const indexingServiceAccount = require("../keys/indexing-service-account.json");
const spreadsheetServiceAccount = require("../keys/spreadsheet-service-account.json");

module.exports = {
  indexingServiceAccount: {
    ...indexingServiceAccount,
    scopes: [
      "https://www.googleapis.com/auth/indexing"
    ]
  },
  spreadsheetServiceAccount: {
    ...spreadsheetServiceAccount,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets"
    ]
  },
  indexingGoogleApi: "https://indexing.googleapis.com/v3/urlNotifications:publish",
  indexingGoogleBatchApi: "https://indexing.googleapis.com/batch",
  indexingIndexNowApi: "https://www.bing.com/indexnow",
  indexingSpreadsheetId: process.env.INDEXING_SPREADSHEET_ID || '',
  indexingSuccessSpreadsheetId: process.env.INDEXING_SUCCESS_SPREADSHEET_ID || '',
  indexingSheetName: process.env.INDEXING_SHEET_NAME || '',
  indexingSuccessSheetName: process.env.INDEXING_SUCCESS_SHEET_NAME || '',
  indexNowApiKey: process.env.INDEXNOW_API_KEY || ''
};
