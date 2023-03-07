const { Service } = require('egg');
const puppeteer = require('puppeteer');
const fsPromises = require('fs').promises;

const { pageRoute } = require('../lib/enum');

const browserConfig = {
  headless: true,
  args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
  ],
};

const pdfConfig = {
  displayHeaderFooter: false,
  printBackground: true,
};

class PDFService extends Service {
  async createPDF(params) {
    try {
      const { host, port } = this.config.env.export;

      // 页面参数
      const query = {
        type: 'EXPORT',
        id: params.id,
        paperId: params.paperId,
        operatorId: params.operatorId,
        operatorName: params.operatorName,
      };
      let url = `http://${host}:${port}/#/${pageRoute[params.type]}`;
      Object.keys(query).forEach((key, index) => {
        url += index ? `&${key}=${query[key]}` : `?${key}=${query[key]}`;
      });

      const pdf = await this.buildPDF(url, params);
      this.savePDF(pdf);

      this.notify({
        success: true,
        desc: '操作成功',
        data: {
          file: pdf,
          taskId: params.taskId,
        },
      });

    } catch (error) {
      this.notify({
        file: null,
        success: false,
        desc: error,
        data: {
          file: null,
          taskId: params.taskId,
        },
      });
    }
  }
  async buildPDF(url, params) {
    // 启动浏览器
    const browser = await puppeteer.launch(browserConfig);
    try {
      // 开启新TAB
      const page = await browser.newPage();

      // 控制台日志
      page
        // .on('console', message =>
        //   console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
        .on('pageerror', ({ message }) => console.log(message))
        // .on('response', response =>
        //   console.log(`${response.status()} ${response.url()}`))
        .on('requestfailed', request =>
          console.log(`${request.failure().errorText} ${request.url()}`));

      // 设置视窗尺寸
      await page.setViewport({
        width: params.width,
        height: params.height,
      });

      // 页面跳转
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 0,
      });

      // 生成PDF Buffer
      const PDFBuffer = await page.pdf({
        width: params.width,
        height: params.height,
        ...pdfConfig,
      });
      return PDFBuffer;
    } catch (error) {
      throw error;
    } finally {
      browser.close();
    }
  }
  async savePDF(file) {
    fsPromises.writeFile('./file/test.pdf', file, function(err) {
      return err;
    });
  }
  async notify(data) {
    try {
      const { callbackService } = this.config.env.export;

      const app = global.eureka.cache.app[callbackService];
      const callbackUrl = `http://${app.ipAddr}:${app.port.$}/file/export/task`;

      const response = await this.ctx.curl(callbackUrl, {
        method: 'POST',
        timeout: 1000 * 60 * 5,
        data,
      });
      return !!response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = PDFService;
