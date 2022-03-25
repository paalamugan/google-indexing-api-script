require("dotenv").config(); // Load a .env file

const {
  getSpreadSheetRowsValues,
  deleteSpreadSheetRowsValues,
  appendSpreadSheetRowsValues,
  getCombineIndexingResponse,
} = require("./helper");
const {
  MAXIMUM_SHEET_RANGE_PER_BATCH,
  MAXIMUM_SHEET_RANGE_PER_DAY,
} = require("./constants");
const { updateIndexNowUrls } = require("./services/indexnow-indexing-service");
const { updateIndexingUrls } = require("./services/google-indexing-service");
const { validIndexingUrls } = require("./utils");

const main = async (
  rangeStart = 1,
  rangeEnd = MAXIMUM_SHEET_RANGE_PER_BATCH,
  batchSet = 1
) => {
  try {
    if (rangeStart > MAXIMUM_SHEET_RANGE_PER_DAY) {
      await deleteSpreadSheetRowsValues(rangeStart - 1);
      return;
    }

    const { values, range } = await getSpreadSheetRowsValues(
      rangeStart,
      rangeEnd
    );

    if (!values.length) {
      await deleteSpreadSheetRowsValues(rangeStart);
      return;
    }

    const urls = validIndexingUrls(values[0]);

    const googleResponse = await updateIndexingUrls(urls);
    const indexNowResponse = await updateIndexNowUrls(urls);

    const { totalRowCount, updatedRowUrls } = getCombineIndexingResponse(
      urls,
      googleResponse,
      indexNowResponse
    );
    await appendSpreadSheetRowsValues(updatedRowUrls);

    console.log(
      `---${batchSet} Batch Indexing urls finished range between ${range}---`
    );

    main(rangeEnd + 1, rangeEnd + totalRowCount, ++batchSet);
  } catch (err) {
    throw err;
  }
};

module.exports = main;
