
const chalk = require('chalk');
const log = console.log
const md5 = require('md5')
const main = async(page, url, app) => {

  await page.goto(url)
  log(chalk.yellow('页面初次加载完毕'))

  //滑动动态加载
  // await page.waitFor(2500)
  const targetUrl = await page.evaluate(() => {
    return document.querySelector('a.find-more').href
     
  })
  await page.goto(targetUrl)
  log(chalk.yellow('进入列表页'))
  //解析作者列表

  const resList = await handleListData(page)
  const reuslt = []
  //解析详情页
  if(resList.length > 0 ){
    for( let i = 0 ; i < resList.length ; i++ ) {
      let item = resList[i]
      let url = item.url
      //检查数据库中是否已经存在该记录
      const post = await app.mysql.get('author', { urlMd5: md5(url) });
      if(post) {
        continue
      }
      
      await page.goto(url)
      log(chalk.yellow( '进入详情页' ))
      let nextItem = await handleDetailData(page)
      item = {...item, ...nextItem}

      reuslt.push({...item, ...nextItem, urlMd5: md5(url)})
    }
  }
  return reuslt
}

//解析列表页
const handleDetailData = async (page) => {
  let item = await page.evaluate(() => {
    let item = {}

    item.avatar = document.querySelector('a[class="avatar"] > img').src
    item.name = document.querySelector('.title').innerText
    item.concernNum = +(document.querySelector('.info > ul > li:nth-child(1)	p').innerText)
    item.fansNum = +(document.querySelector('.info > ul > li:nth-child(2)	p').innerText)
    item.articleNum = +(document.querySelector('.info > ul > li:nth-child(3)	p').innerText)
    item.wordNum = +(document.querySelector('.info > ul > li:nth-child(4)	p').innerText)
    item.enjoyNum = +(document.querySelector('.info > ul > li:nth-child(5)	p').innerText)
    item.createTime = Date.parse(new Date())
    item.updateTime = Date.parse(new Date())
    return item
  })
  return item
}

//解析列表页
const handleListData = async (page) => {
  let resList = await page.evaluate(() => {
    let list = []
    let itemList = document.querySelectorAll('.wrap')
    for (let key in itemList) {
      let item = itemList[key]      
      if(item && item.querySelector) {
        let url = item.querySelector('a').href
        list.push({
          url
        })
      }
    }
    return list
  })
  return resList
}

module.exports = main