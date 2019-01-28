const FALCON_CART_EMAIL = '#falcon-cart.falcon-cart--enroll input'
const FALCON_CART_BUTTON = '#falcon-cart.falcon-cart--enroll button'

const waitForIFrameLoad = (page, iframeSelector, timeout = 10000) =>
  // if pageFunction returns a promise, $eval will wait for its resolution
  page.$eval(
    iframeSelector,
    (el, timeout) => {
      const p = new Promise((resolve, reject) => {
        el.onload = a => {
          console.log('this is the event: ', a)
          resolve()
        }
        setTimeout(() => {
          reject(new Error('Waiting for iframe load has timed out'))
        }, timeout)
      })
      return p
    },
    timeout
  )
const enrollWithEmail = async page => {
  await page.waitForSelector(FALCON_CART_EMAIL)
  await page.click(FALCON_CART_EMAIL)
  await page.type(FALCON_CART_EMAIL, `testname+${Date.now()}@masterclass.com`)
  await page.click(FALCON_CART_BUTTON)
}

const fillInGiftForm = async page => {
  await page.waitForSelector('input[name="gifteeName"]')
  await page.click('input[name="gifteeName"]')
  await page.type('input[name="gifteeName"]', 'User Name', { delay: 100 })

  await page.click('input[name="gifteeEmail"]')
  await page.type('input[name="gifteeEmail"]', 'testgiftee@masterclass.com')

  await page.click('input[name="gifterName"]')
  await page.type('input[name="gifterName"]', 'Gifter Name', { delay: 100 })

  // This part is already filled in
  // await page.click('input[name="gifterEmail"]')
  // await page.type('input[name="gifterEmail"]', 'gifteremail@masterclass.com', { delay: 100 })

  await page.click('#falcon-cart button[type="submit"] span')
}

const cartPurchase = async page => {
  // This portion waits for stripe iframes and fills in the credit card
  // information for the falcon cart
  await page.waitForSelector('iframe[name="__privateStripeFrame7"]')
  await page.waitForSelector('iframe[name="__privateStripeFrame8"]')
  const watchdog1 = waitForIFrameLoad(
    page,
    'iframe[name="__privateStripeFrame7"]'
  )
  const watchdog2 = waitForIFrameLoad(
    page,
    'iframe[name="__privateStripeFrame8"]'
  )
  const watchdog3 = waitForIFrameLoad(
    page,
    'iframe[name="__privateStripeFrame9"]'
  )
  await watchdog1
  await watchdog2
  await watchdog3

  const frames = await page.frames()

  const stripeCardNumberFrame = await frames.find(
    f => f.name() === '__privateStripeFrame7'
  )
  const stripeCardExpFrame = await frames.find(
    f => f.name() === '__privateStripeFrame8'
  )
  const stripeCardCVCFrame = await frames.find(
    f => f.name() === '__privateStripeFrame9'
  )

  await stripeCardNumberFrame.click(
    '#root > form > span:nth-child(4) > label > input'
  )
  await stripeCardNumberFrame.type(
    '#root > form > span:nth-child(4) > label > input',
    '4242424242424242',
    { delay: 100 }
  )
  await stripeCardExpFrame.click(
    '#root > form > span:nth-child(4) > label > input'
  )
  await stripeCardExpFrame.type(
    '#root > form > span:nth-child(4) > label > input',
    '1020',
    { delay: 100 }
  )
  await stripeCardCVCFrame.click(
    '#root > form > span:nth-child(4) > label > input'
  )
  await stripeCardCVCFrame.type(
    '#root > form > span:nth-child(4) > label > input',
    '591',
    { delay: 100 }
  )

  // This portion fills out the name and password after purchase for the account
  await page.click('button[type="submit"] > span')
  await page.waitForSelector('input[name="password"]')
  await page.waitForSelector('input[name="name"]')

  await page.click('#falcon-cart input[name="name"]')
  await page.type('#falcon-cart input[name="name"]', 'User Name', {
    delay: 100
  })
  await page.click('#falcon-cart input[name="password"]')
  await page.type('#falcon-cart input[name="password"]', 'password', {
    delay: 100
  })
  page.click('#falcon-cart button[type="submit"] > span')

  // This is the HDYHAU survey - waits for the survey to be available and then
  // just clicks the submit button without choosing an option
  await page.waitForXPath('//h2[text()="How did you hear about MasterClass?"]')
  page.click('#falcon-cart button[type="button"]')
}

module.exports.cartPurchase = cartPurchase
module.exports.enrollWithEmail = enrollWithEmail
module.exports.fillInGiftForm = fillInGiftForm
