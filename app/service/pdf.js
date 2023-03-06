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
  margin: {
    top: 50,
    bottom: 50,
    left: 0,
    right: 0,
  },
  displayHeaderFooter: false,
  printBackground: true,
};

class PDFService extends Service {
  async createPDF(params) {
    try {
      const { host, port } = this.config.env;
      const url = `http://${host}:${port}/${pageRoute[params.type]}/?id=${params.id}&type=export`;

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
      const PDFBuffer = await page.pdf(pdfConfig);
      return PDFBuffer;
    } catch (error) {
      throw error;
    } finally {
      browser.close();
    }
  }
  async savePDF(file) {
    fsPromises.writeFile('./file/test.pdf', file, function(err) {
      console.log(err);
    });
  }
  async notify(data) {
    try {
      const { callbackUrl } = this.config.env;

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
