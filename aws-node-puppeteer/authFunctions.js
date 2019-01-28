const LOGIN_MODAL_SELECTOR = '#mc-user-login a'
const CREATE_MODAL_SELECTOR = 'form#sign-in-form p.button_desc a.legacy-mc-modal-register-trigger'

/*
  Currently this selector isn't specific to one instructor and returns all 52
*/
const ALL_ACCESS_CART = 'a.mc-button.ap-hero-content__primary-cta'
const FALCON_CART_EMAIL = '#falcon-cart.falcon-cart--enroll input'
const FALCON_CART_BUTTON = '#falcon-cart.falcon-cart--enroll button'


const openLoginModal = async (page) => {
  page.evaluate((selector) => {
    document.querySelector(selector).click()
  }, LOGIN_MODAL_SELECTOR)
}

const signUpNonPurchase = async (page) => {
  await openLoginModal(page)
  page.evaluate((selector) => {
    document.querySelector(selector).click()
    document.querySelector('#sign-up-email').value = `testname+${Date.now()}@masterclass.com`
    document.querySelector('#sign-up-password').value = 'password'
    document.querySelector('#sign-up-account-submit-button').click()
  }, CREATE_MODAL_SELECTOR)
}

const waitForIFrameLoad = (page, iframeSelector, timeout = 10000) => {
  // if pageFunction returns a promise, $eval will wait for its resolution
  return page.$eval(
    iframeSelector,
    (el, timeout) => {
      const p = new Promise((resolve, reject) => {
        el.onload = (a) => {
          console.log('this is the event: ', a)
          resolve()
        }
        setTimeout(() => {
          reject(new Error("Waiting for iframe load has timed out"))
        }, timeout)
      })
      return p
    },
    timeout,
  )
}

const homepageOpenAllAccess = async (page) => {
  await page.evaluate((selector) => {
    document.querySelector(selector).click()
  }, ALL_ACCESS_CART);

  // await page.waitForSelector(FALCON_CART_EMAIL);
  // await page.click(FALCON_CART_EMAIL);
  // await page.type(FALCON_CART_EMAIL, `testname+${Date.now()}@masterclass.com`);
  // await page.click(FALCON_CART_BUTTON);
  // const frames = await page.frames();
  // // console.log('before the waiting: ', frames.length);
  // page.waitForSelector('iframe[name="__privateStripeFrame7"]').then((frame) => {
  //   Array.from(page.frames(), (frame) => {
  //     console.log('this is the frame name: ', frame.name())
  //   })
  // });

  // console.log('after the waiting outside of the promise: ', page.frames().length)
}

module.exports.signUpNonPurchase = signUpNonPurchase
module.exports.openLoginModal = openLoginModal
module.exports.homepageOpenAllAccess = homepageOpenAllAccess
