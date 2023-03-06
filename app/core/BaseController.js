const { Controller } = require('egg');

class BaseController extends Controller {

  success(data, desc) {
    this.ctx.body = {
      code: 200,
      data,
      desc,
    };
  }

  fail(data, desc, code) {
    this.ctx.body = {
      code,
      data,
      desc,
    };
  }
}

module.exports = BaseController;
