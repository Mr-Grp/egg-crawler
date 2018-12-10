const puppeteer = require('puppeteer');
// const logger = require('@shuwen/logger');

const browser = puppeteer.launch({
  // executablePath: '/usr/bin/chromium-browser',
  headless: false,
  args: ["--no-sandbox" , "--disable-setuid-sandbox"],
})
// logger.info('服务正常启动')


const parseUrl = async (url, opts) => {
  const browserInstance = await browser
  const pages = await browserInstance.pages()
  // if(pages.length > 15){
  //   return {
  //     success: false,
  //     code: 2,
  //     msg: '并发数大于10,请重试',
  //     data: url
  //   }
  // }
    
  
  let page1
  if(opts.furl){
    try {
      page1 = await browserInstance.newPage()
      await page1.goto(opts.furl)
    } catch (error) {
      await page1.close()
      // logger.error(error)
      return {
        success: false,
        msg: error.message,
        data: url
      }
    }
  }

  const page = await browserInstance.newPage()

  try {


    await page.goto(url)
    // logger.info('页面初次加载完毕')
    // logger.info(url)
    const res = await page.evaluate(() => {
      return {
        cookie: document.cookie,
        url: document.location.href,
        sourcecode: '<html>' + document.getElementsByTagName('html')[0].innerHTML + '</html>'
      }
    })
    // await page.close()
    page1 && await page1.close()
    // logger.info('页面关闭')
    return {
      success: true,
      data: res
    }

  } catch (error) {
    page1 && await page1.close()
    await page.close()
    // logger.error(error)
    return {
      success: false,
      msg: error.message,
      data: url
    }
    
  }

}

module.exports = parseUrl