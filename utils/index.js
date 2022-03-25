const { google } = require("googleapis");

const getJwtClient = (serviceAccount) => {
  if (!serviceAccount || !serviceAccount.client_email) {
    throw new Error("Google service account client_email is missing!");
  }

  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    serviceAccount.scopes
  );

  return jwtClient;
};

const convertJsonToSheetValues = (rows) => {
  const result = [];

  if (!rows || !rows.length) {
    return result;
  }

  rows.forEach((row) => {
    const values = Object.values(row);
    result.push(values);
  });

  return result;
};

const validIndexingUrls = (urls) => {
  if (!urls || !urls.length) {
    throw new Error("Indexing Urls is missing!");
  }
  
  if (typeof urls === "string") {
    urls = [urls];
  }
  
  urls = urls.filter((url) => !!url);

  return urls;
}

module.exports = {
  getJwtClient,
  convertJsonToSheetValues,
  validIndexingUrls
};
