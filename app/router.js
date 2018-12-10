'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/puppeteer/getdata', controller.crawler.index);
  router.get('/parse/url', controller.parse.url);
};
