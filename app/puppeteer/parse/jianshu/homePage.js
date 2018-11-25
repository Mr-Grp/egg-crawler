
const chalk = require('chalk');
const common = require('../../common')
const log = console.log
const md5 = require('md5')
const main = async(page, url, app, opts = {}) => {

  await page.goto(url)
  log(chalk.yellow('页面初次加载完毕'))

  //滑动动态加载
  // await page.waitFor(1000)
  await common.scroll(page, { ...opts.scroll } );
  await common.sleep(2500)
  //点击动态加载
  for( let i = 0 ; i < opts.pageNum ; i++ ) {
    page.click('a.load-more')
    await common.sleep(1000)
  }

  //解析列表也
  const resList = await handleListData(page)
  const reuslt = []
  //解析详情页
  if(resList.length > 0 ){
    for( let i = 0 ; i < resList.length ; i++ ) {
      let item = resList[i]
      let url = item.url
      //检查数据库中是否已经存在该记录
      const post = await app.mysql.get('article', { urlMd5: md5(url) });
      if(post) {
        log(chalk.yellow( post.type ))
        log(chalk.yellow( opts.type ))
        if(!(post.type.indexOf(opts.type) > -1)){
          log(chalk.yellow( post.type + opts.type ))
          const row = {
            type: post.type + opts.type,
          };
          const options = {
            where: {
              urlMd5: md5(url)
            }
          };
          await app.mysql.update('article', row, options );
        }
        continue
      }
      await page.goto(url)
      log(chalk.yellow( '进入详情页' ))
      let nextItem = await handleDetailData(page, opts.type)
      item = {...item, ...nextItem}
      reuslt.push({...item, ...nextItem, urlMd5: md5(url)})
    }
  }
  return reuslt
}

//解析列表页
const handleDetailData = async (page, type) => {
  let item = await page.evaluate((type) => {
    let item = {}

    avatarDom = document.querySelector('div.author > a[class="avatar"] > img')
    if(avatarDom) {
      item.avatar = document.querySelector('div.author > a[class="avatar"] > img').src
    }
    item.author = document.querySelector('div.author > div[class="info"] > span[class="name"]').innerText
    item.pubTime = document.querySelector('.publish-time').innerText
    item.wordNum = +(document.querySelector('.wordage').innerText.split(/\s+/)[1])
    item.enjoyNum = +(document.querySelector('.likes-count').innerText.split(/\s+/)[1])
    item.commentNum = +(document.querySelector('.comments-count').innerText.split(/\s+/)[1])
    item.readNum = +(document.querySelector('.views-count').innerText.split(/\s+/)[1])
    item.contenthtml = document.querySelector('.show-content-free').innerHTML
    item.type = type
    item.createTime = Date.parse(new Date())
    item.updateTime = Date.parse(new Date())
    return item
  }, type)
  return item
}

//解析列表页
const handleListData = async (page) => {
  let resList = await page.evaluate(() => {
    let list = []
    let itemList = document.querySelectorAll('li[id^="note"]')
    for (let key in itemList) {
      let item = itemList[key]      
      if(item && item.querySelector) {
        let titleDom = item.querySelector('.title')
        let title = titleDom.innerHTML
        let url = titleDom.href
        let coverDom = item.querySelector('a > img')
        let coverImg = ''
        if(coverDom) {
          coverImg = coverDom.src
        }
        list.push({
          title,
          url,
          coverImg
        })
      }
    }
    return list
  })
  return resList
}

module.exports = main