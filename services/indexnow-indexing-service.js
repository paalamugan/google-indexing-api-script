const request = require("request-promise");

const { indexingIndexNowApi, indexNowApiKey } = require("../config");

const errorMessase = {
  200: "URL submitted successfully",
  202: "Accepted",
  400: "Invalid format",
  403: "In case of key not valid (e.g. key not found, file found but key not in the file)",
  422: "In case of URLs don’t belong to the host or the key is not matching the schema in the protocol",
  429: "Too Many Requests (potential Spam)",
};

const postRequestOptions = (urls) => {

  const firstUrl = new URL(urls[0]);

  return {
    url: indexingIndexNowApi,
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    resolveWithFullResponse: true,
    json: true,
    body: {
      host: firstUrl.host,
      key: indexNowApiKey,
      keyLocation: `${firstUrl.origin}/${indexNowApiKey}.txt`,
      urlList: [...urls],
    },
  };
};

const getRequestOptions = (url) => {
  return {
    url: indexingIndexNowApi,
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    resolveWithFullResponse: true,
    qs: {
      url,
      key: indexNowApiKey
    }
  };
}

const getBatchRequest = (urls) => {
  return urls.map((url) => {
    const options = getRequestOptions(url);
    return request(options);
  });
};

const updateIndexNowUrls = async (urls) => {
  try {
    const batchRequests = getBatchRequest(urls);
    
    const results = await Promise.allSettled(batchRequests);

    let data = [];

    results.forEach((result) => {
      if (result.status !== "fulfilled") {
        console.error(`\nIndexNow URL ERROR MESSAGE: "${result.reason?.message}"`);
        data.push(`ERROR MESSAGE: "${result.reason?.message}"`);
        return;
      }
      
      let message = errorMessase[result.value.statusCode] || 'Invalid Request';
      data.push(message);
    });

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  updateIndexNowUrls,
  getBatchRequest,
  getRequestOptions,
  postRequestOptions
};
