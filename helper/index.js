const { convertJsonToSheetValues } = require("../utils");
const {
  indexingSpreadsheetId,
  indexingSheetName,
  indexingSuccessSpreadsheetId,
  indexingSuccessSheetName,
} = require("../config");

const { updateIndexingUrls } = require("../services/google-indexing-service");
const {
  getSpreadSheetValues,
  appendSpreadSheetValues,
  deleteSpreadSheetRows,
  clearSpreadSheetValues,
} = require("../services/google-sheet-service");

const getSpreadSheetRowsValues = async (rangeStart, rangeEnd) => {
  const totalRange = `${indexingSheetName}!A${rangeStart}:A${rangeEnd}`;

  const { values, range } = await getSpreadSheetValues({
    spreadsheetId: indexingSpreadsheetId,
    range: totalRange,
    majorDimension: "COLUMNS",
  });

  if (!values?.length) {
    // console.log(`Sheet values not found range between at ${totalRange}.`);
    return { values: [] };
  }

  return { values, range };
};

const deleteSpreadSheetRowsValues = async (rangeEnd) => {
  if (rangeEnd <= 1) return;

  await deleteSpreadSheetRows({
    spreadsheetId: indexingSpreadsheetId,
    sheetName: indexingSheetName,
    start: 0,
    end: rangeEnd,
  });
};

const appendSpreadSheetRowsValues = async (updatedRowUrls = []) => {
  if (!updatedRowUrls.length) return;
  
  await appendSpreadSheetValues({
    spreadsheetId: indexingSuccessSpreadsheetId,
    range: `${indexingSuccessSheetName}!A:Z`,
    values: updatedRowUrls,
  });
};

const updatedRowsIndexingUrls = async (values = []) => {
  const result = {
    totalRowCount: 0,
    updatedRowCount: 0,
    updatedRowUrls: [],
  };

  const firstColumnValues = values[0] || [];

  if (!firstColumnValues.length) {
    return result;
  }

  result.totalRowCount = firstColumnValues.length;
  result.updatedRowUrls = await updateIndexingUrls(firstColumnValues) || [];

  return result;
};

const getCombineIndexingResponse = (indexingUrls, googleResponse, indexNowResponse) => {
  const result = {
    totalRowCount: indexingUrls.length,
    updatedRowUrls: [],
  };

  indexingUrls.forEach((url, index) => {
    let row = [
      url, 
      googleResponse[index],
      indexNowResponse[index]
    ]
    result.updatedRowUrls.push(row);
  });

  return result;
}

const clearSpreadSheetRowsValues = async (rangeEnd) => {
  const rangeStart = 1;
  const result = await clearSpreadSheetValues({
    spreadsheetId: indexingSpreadsheetId,
    range: `${indexingSheetName}!${rangeStart}:${rangeEnd}`,
  });
  return result;
}

module.exports = {
  getSpreadSheetRowsValues,
  deleteSpreadSheetRowsValues,
  appendSpreadSheetRowsValues,
  updatedRowsIndexingUrls,
  clearSpreadSheetRowsValues,
  getCombineIndexingResponse
};
