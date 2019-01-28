const launchChrome = require('@serverless-chrome/lambda');
const request = require('superagent');

module.exports.getChrome = async () => {
  const flags = [
      '--disable-features=site-per-process',
      '--no-sandbox',
      '--disable-setuid-sandbox'
  ]
  const chrome = await launchChrome({flags});

  const response = await request
    .get(`${chrome.url}/json/version`)
    .set('Content-Type', 'application/json');

  const endpoint = response.body.webSocketDebuggerUrl;

  return {
    endpoint,
    instance: chrome,
  };
};
