# Google Indexing API Script

**Using this script helps to index your website and make your website ranking first in Google Search.**

Requires node.js - https://nodejs.org/en/download/

This script will help you index your website's pages in bulk, without having to manually request each URL for submission in the Search Console interface.

First off you will need to set up access to the Indexing API in Google Cloud Platform - follow the instructions below.

https://developers.google.com/search/apis/indexing-api/v3/prereqs

Once you have access to Indexing API you'll be able to download a public/private key pair JSON file, this contains all of your credentials and should be saved as "service_account.json".

Add the URLs to the urls.txt file that you need to be crawled/indexed.


## Verify site ownership in Search Console to submit URLs for indexing
In this step, you'll verify that you have control over your web property.

To verify ownership of your site you'll need to add your service account email address (see service_account.json - client_email) and add it as an owner ('delegated') of the web property in Search Console.

You can find your service account email address in two places:
- The client_email field in the JSON private key that you downloaded when you created your project.
- The Service account ID column of the Service Accounts view in the Developer Console.
- The email address has a format similar to the following:

For example, "my-service-account@my-project-42.google.com.iam.gserviceaccount.com".

Then...

1. Go to [Google Webmaster Central](https://www.google.com/webmasters/verification/home)
2. Click your verified property
3. Scroll down and click 'Add an owner'.
4. Add your service account email address as an owner to the property.


## Quotas

100 URLs per request batch

200 URLs per day

## GET STARTED

- Node Engine
```sh
node - 14.17.5
npm - 6.14.14
```

- Install Dependencies
```sh
npm install
```

- You need to be add important environment variable in `.env` file, Below you can find the sample example of `.env` file variables.

```sh
INDEXNOW_API_KEY='bd1c8878880ef483d8c74caf71209ff21'
INDEXING_SPREADSHEET_ID='1OOAa59Mu4OyYVBdeoGHwJFaZFn36wA7H007nlRGpLfo'
INDEXING_SUCCESS_SPREADSHEET_ID='1zOofPBvE-OafrPlfXYA_26sv-8uWq3BXlbIFOz1BSuU'
INDEXING_SHEET_NAME='Sheet1'
INDEXING_SUCCESS_SHEET_NAME='Sheet1'
HTTP_PROXY=''
HTTPS_PROXY=''
```

- To run application in development mode
```sh
npm run dev
```

- To run application in production mode

**Run Script only once, Using below command**
```sh
npm run start
```

**Run Script automatically with Scheduler function, Using below command**
```sh
npm run scheduler
```

### Google Spreadsheet Indexing Format

- From Indexing Spreadsheet format.(Where we get all urls)

| URLS   |
| --- |
| https://example.com/path-to-url | 
| https://example.com/path-to-url1 |
| https://example.com/path-to-url2 |

- To Indexing Success Spreadsheet format.(Where we add the response of all urls)

| URL | Google Indexing Response | IndexNow Indexing Response |
| --- | ------------------------ | ------------- |
| https://example.com/path-to-url | Response message from Google indexing | Response message from IndexNow Indexing |
| https://example.com/path-to-url1 | Response message from Google indexing | Response message from IndexNow Indexing |
| https://example.com/path-to-url2 | Response message from Google indexing | Response message from IndexNow Indexing |

### Tips

- [Google Sheets API Overview](https://developers.google.com/sheets/api/guides/concepts)
- [Using the Indexing API for google](https://developers.google.com/search/apis/indexing-api/v3/using-api)
- [Indexnow Indexing Documentation](https://www.indexnow.org/documentation)
- [Samples Example of Indexnow Apis](https://www.bing.com/indexnow#samples)
