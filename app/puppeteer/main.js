const puppeteer = require('puppeteer');
const chalk = require('chalk');
const log = console.log

async function main(parse, url, app, options) {
  // 首先通过Puppeteer启动一个浏览器环境
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox" , "--disable-setuid-sandbox"]
  })
  log(chalk.green('服务正常启动'))
  try {
    const page = await browser.newPage()
    // 监听页面内部的console消息
    page.on('console', msg => {
      if (typeof msg === 'object') {
       console.dir(msg)
      } else {
       log(chalk.blue(msg))
      }
    })

    const result = await parse(page, url, app, options)

    // 所有的数据爬取完毕后关闭浏览器
    await browser.close()
    log(chalk.green('服务正常结束'))
    return {
      data: result,
      success: true
    } 
  } catch (error) {
    await browser.close()
    log(chalk.red('服务意外终止'))
    log(chalk.red(error))
    return {
      success: false,
      msg: error
    } 
  }
}

module.exports = main