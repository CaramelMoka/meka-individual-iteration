const { setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

class CustomWorld {
  constructor() {}
  async init() {
    this.browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    this.page = await this.browser.newPage();
  }
  async close() {
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);