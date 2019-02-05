const puppeteer = require('puppeteer');
const { getChrome } = require('./chrome-script');
const { homepageOpenAllAccess } = require('./authFunctions');
const { cartPurchase, enrollWithEmail } = require('./cartPurchase');

const worker = async (event) => {
  const { url } = event.queryStringParameters;

  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });


  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  await homepageOpenAllAccess(page)
  await enrollWithEmail(page)
  await cartPurchase(page)

  const content = await page.evaluate(() => document.body.innerHTML);
  console.log('the return: *******************')
  console.log(content)
}

module.exports.hello = async (event) => {
  worker(event)
  // const { url } = event.queryStringParameters;
  //
  // const chrome = await getChrome();
  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: chrome.endpoint,
  // });
  //
  //
  // const page = await browser.newPage();
  // await page.goto(url, { waitUntil: 'networkidle0' });
  //
  // await homepageOpenAllAccess(page)
  // await enrollWithEmail(page)
  // await cartPurchase(page)
  //
  // await page.waitForSelector('.heading-primary.welcome-header-title')
  //
  // const content = await page.evaluate(() => document.body.innerHTML);
  return {
    statusCode: 200,
    body: JSON.stringify({
      content,
    }),
  };
};
