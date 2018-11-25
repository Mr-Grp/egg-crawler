const Subscription = require('egg').Subscription;
const puppeteer = require('../puppeteer/main')
const authorParse = require('../puppeteer/parse/jianshu/author')

class getData extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 0 */7 * *',
      type: 'all',
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this
    const { app } = ctx

    // 推荐作者
    const authorRes = await puppeteer(authorParse, 'https://www.jianshu.com/', app)
    if(authorRes.success && authorRes.data.length > 0) {
      await ctx.service.jianshu.saveAuthor(authorRes.data)
    }
    
  }
}

module.exports = getData;