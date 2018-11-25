
const chalk = require('chalk');
const common = require('../common')
const log = console.log


async function parse (page, url)  {
  
  if(url.length === 0){
    return 
  }
  let res_list = []
  for(let i = 0 ; i < url.length ; i++) {
    await page.goto(url[i])
    // await common.sleep(2000)
    log(chalk.yellow('页面初次加载完毕'))
    let data = await handleData(page)
    res_list.push(data)
  }
  
  return res_list
}

async function handleData(page) {
  let res = await page.evaluate(() => {
    return {
      url: document.location.href,
      sourcecode: '<html>' + document.getElementsByTagName('html')[0].innerHTML + '</html>'
    }
  })

  return res
}

module.exports = parse