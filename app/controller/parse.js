'use strict';
const parseUrl = require('../puppeteer/sourceCode')
const Controller = require('egg').Controller;

class ParseController extends Controller {
  async url() {
    const { ctx } = this
    const url = ctx.query && ctx.query.url ? ctx.query.url : null
    const furl = ctx.query && ctx.query.furl ? ctx.query.furl : null
    if(!url){
      this.ctx.body = {
        success: false,
        msg: '请填写url'
      }
      return
    }
    const res = await parseUrl(url, {furl})
    this.ctx.body = res;
  }
}

module.exports = ParseController;
