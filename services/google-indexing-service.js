const request = require("request-promise");

const {
  indexingServiceAccount,
  indexingGoogleApi,
  indexingGoogleBatchApi,
} = require("../config");
const { getJwtClient } = require("../utils");

let jwtClient;
const getIndexingJwtClient = () => {
  if (jwtClient) return jwtClient;
  jwtClient = getJwtClient(indexingServiceAccount);
  return jwtClient;
};

const indexingGoogleApiUrl = new URL(indexingGoogleApi);

const postRequestOptions = (url, type) => ({
  url: indexingGoogleApiUrl.href,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: { url, type },
});

const formatGoogleIndexingResponse = (data) => {
  const urlNotificationMetadata = data?.urlNotificationMetadata;

  if (!urlNotificationMetadata) return;

  const { url, notifyTime } = urlNotificationMetadata.latestUpdate;

  return {
    url,
    lastUpdatedAt: new Date(notifyTime).toLocaleString(),
  };
};

const getBatchRequest = (urls) => {
  const client = getIndexingJwtClient();
  return urls.map((url) => {
    const options = postRequestOptions(url, "URL_UPDATED");
    return client.request(options);
  });
};

const updateIndexingUrls = async (urls) => {
  try {
    const batchRequests = getBatchRequest(urls);

    const results = await Promise.allSettled(batchRequests);

    let data = [];

    results.forEach((result) => {
      if (result.status !== "fulfilled") {
        console.error(`\nFAILED INDEXING URL: ${result.reason?.response?.config?.data?.url}, REASON: "${result.reason?.message}"`);
        data.push(`ERROR MESSAGE: "${result.reason?.message}"`);
        return;
      }

      if (result.value.status > 399) {
        console.error(`\nFAILED INDEXING URL: ${result.value?.config?.data?.url}, REASON: "Request failed with status code: ${result.value.status}"`);
        data.push(`ERROR MESSAGE: "Request failed with status code: ${result.value.status}"`);
        return;
      }

      // console.log(`SUCCESSFULLY INDEXED URL: ${result.value.data.url}`);

      data.push(JSON.stringify(result.value.data?.urlNotificationMetadata || 'No Response data found.'));
    });

    return data;
  } catch (err) {
    throw err;
  }
};

const updateBatchIndexingUrls = async (urls) => {
  if (!urls || !urls.length) {
    throw new Error("Batch Urls is missing");
  }

  const client = getIndexingJwtClient();

  const { token } = await client.getAccessToken();

  const items = urls.map((url) => {
    return {
      "Content-Type": "application/http",
      "Content-ID": Math.floor(
        Math.random() * Number.MAX_SAFE_INTEGER
      ).toString(),
      body:
        "POST " +
        indexingGoogleApiUrl.pathname +
        " HTTP/1.1\n" +
        "Content-Type: application/json\n\n" +
        JSON.stringify({ url: url, type: "URL_UPDATED" }),
    };
  });

  const options = {
    url: indexingGoogleBatchApi,
    method: "POST",
    headers: {
      "Content-Type": "multipart/mixed",
    },
    auth: { bearer: token },
    multipart: items,
  };

  const res = await request(options);
  return res;
};

module.exports = {
  getIndexingJwtClient,
  updateIndexingUrls,
  updateBatchIndexingUrls,
};
