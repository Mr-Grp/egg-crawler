const Service = require('egg').Service;

class JianshuService extends Service {
  async saveArticle(list) {
    const { app } = this
    const result = await app.mysql.insert(
      'article', 
      list
    );
    return result
  }

  async saveAuthor(list) {
    const { app } = this
    const result = await app.mysql.insert(
      'author', 
      list
    );
    return result
  }

}

module.exports = JianshuService;