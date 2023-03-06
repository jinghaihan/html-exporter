'use strict';
const uuid = require('uuid');
const BaseController = require('../core/BaseController');
// const PDFService = require('../service/pdf');

class PDFController extends BaseController {
  async export() {
    try {
      const { ctx } = this;
      const body = ctx.request.body;
      const taskId = uuid.v4();

      ctx.service.pdf.createPDF({
        taskId,
        ...body,
        width: Number(body.width),
        height: Number(body.height),
      });

      this.success(taskId, '操作成功');
    } catch (error) {
      this.fail(500, error.message || '服务器内部错误');
    }
  }
}

module.exports = PDFController;
