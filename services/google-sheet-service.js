const { google } = require("googleapis");
const { spreadsheetServiceAccount } = require("../config");
const { getJwtClient } = require("../utils");

const sheets = google.sheets("v4");

let jwtClient;
const getSheetJwtClient = () => {
  if (jwtClient) return jwtClient;
  jwtClient = getJwtClient(spreadsheetServiceAccount);
  return jwtClient;
};

google.options({ auth: getSheetJwtClient() });

const getSpreadSheet = async (spreadsheetId) => {
  const response = await sheets.spreadsheets.get({ spreadsheetId });
  return response.data;
};

const getSpreadSheetValues = async ({
  spreadsheetId,
  range,
  majorDimension = "ROWS",
}) => {
  const request = {
    spreadsheetId,
    range,
    majorDimension,
  };
  const response = await sheets.spreadsheets.values.get(request);
  return response.data;
};

const appendSpreadSheetValues = async ({
  spreadsheetId,
  range,
  majorDimension = "ROWS",
  values,
}) => {
  const request = {
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      majorDimension,
      values,
    },
  };

  const response = await sheets.spreadsheets.values.append(request);
  return response.data;
};

const clearSpreadSheetValues = async ({ spreadsheetId, range }) => {
  const request = {
    spreadsheetId,
    range,
  };

  const response = await sheets.spreadsheets.values.clear(request);
  return response.data;
};

const getSheetProperties = async ({ spreadsheetId, sheetName }) => {
  const spreadsheet = await getSpreadSheet(spreadsheetId);

  const sheet = spreadsheet.sheets.find((sheet) => {
    return sheet.properties.title === sheetName;
  });

  return sheet;
};

const deleteSpreadSheetRows = async ({
  spreadsheetId,
  sheetName,
  start = 0,
  end = 1,
}) => {
  if (!sheetName) {
    throw new Error("Sheet name is missing!");
  }

  const sheet = await getSheetProperties({ spreadsheetId, sheetName });

  if (!sheet) {
    throw new Error("Invalid sheet name!");
  }

  const request = {
    spreadsheetId,
    resource: {
      requests: [
        {
          deleteRange: {
            range: {
              sheetId: sheet.sheetId,
              startRowIndex: start,
              endRowIndex: end,
            },
            shiftDimension: "ROWS",
          },
        },
      ],
    },
  };

  const response = await sheets.spreadsheets.batchUpdate(request);
  return response.data;
};

module.exports = {
  getSheetJwtClient,
  getSpreadSheet,
  getSpreadSheetValues,
  getSheetProperties,
  appendSpreadSheetValues,
  clearSpreadSheetValues,
  deleteSpreadSheetRows,
};
