const cron = require('node-cron');
const main = require('./main');

/** 
 * This schedule run each and every day at 00:00 am
 * 
 * For example,
 *   Current date at 2022-01-18 00:00:00
 *   then at 2022-01-19 00:00:00
 *   then at 2022-01-20 00:00:00
 *   then at 2022-01-21 00:00:00
 *   then at 2022-01-22 00:00:00
 *
 */
cron.schedule('00 00 * * *', async() => {
    console.log('\n---Running a task every day at 00:00 am---\n');

    try {
        await main();
        console.log(`\n Google Indexing API is successfully run at ${new Date().toLocaleString()}.\n`)
    } catch (err) {
        console.error(err);
    }
});

console.log('\nAuto Scheduler Indexing API task is running...\n');