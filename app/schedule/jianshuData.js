const Subscription = require('egg').Subscription;
const puppeteer = require('../puppeteer/main')
const homePageParse = require('../puppeteer/parse/jianshu/homePage')

class getData extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 */3 * * *',
      type: 'all',
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this
    const { app } = ctx

    //首页
    const indexRes = await puppeteer(homePageParse, 'https://www.jianshu.com/', app, {type: '_首页', pageNum: 12})
    if(indexRes.success && indexRes.data.length > 0) {
      await ctx.service.jianshu.saveArticle(indexRes.data)
    }

    // 7天
    const weekRes = await puppeteer( 
      homePageParse, 
      'https://www.jianshu.com/trending/weekly?utm_medium=index-banner-s&utm_source=desktop', 
      app, 
      { type: '_7天', pageNum: 2 }
    )
    if(weekRes.success && weekRes.data.length > 0) {
      await ctx.service.jianshu.saveArticle(weekRes.data)
    }
    
    // 30天
    const monthRes = await puppeteer( 
      homePageParse, 
      'https://www.jianshu.com/trending/monthly?utm_medium=index-banner-s&utm_source=desktop', 
      app, 
      { type: '_30天', pageNum: 2 }
    )
    if(monthRes.success && monthRes.data.length > 0) {
      await ctx.service.jianshu.saveArticle(monthRes.data)
    }


    //作者文章
    const results = await app.mysql.select('author', {
      columns: ['url'], 
    });
    let urlList = results.map(item => item.url)
    for(let i = 0 ; i < urlList.length ; i++) {
      const authorArticleRes = await puppeteer(homePageParse, urlList[i], app, {type: '_推荐作者', pageNum: 0, scroll: { maxHeight: 100000 }})
      if(authorArticleRes.success && authorArticleRes.data.length > 0) {
        await ctx.service.jianshu.saveArticle(authorArticleRes.data)
      }
    }
    
  }
}

module.exports = getData;