const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

Given('the user opens the registration form', async function () {
  await this.page.goto('http://localhost:5173');
  await this.page.waitForSelector('.account-icon button');
  await this.page.click('.account-icon button');
  await this.page.waitForSelector('.modal-content');
});

When('the user enters valid registration information', async function () {
  const username = 'newuser_' + Date.now();
  const password = 'secret123';
  await this.page.type('input[placeholder="Username"]', username);
  await this.page.type('input[placeholder="Password"]', password);
  this.newUsername = username;
  await this.page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Create Account'));
    if (btn) btn.click();
  });
  this.page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Account created! Please log in.');
    await dialog.accept();
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
});

Then('the system should create a new account', async function () {
  await this.page.type('input[placeholder="Username"]', this.newUsername);
  await this.page.type('input[placeholder="Password"]', 'secret123');
  await this.page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Log In'));
    if (btn) btn.click();
  });
  await this.page.waitForSelector('.modal-content', { hidden: true, timeout: 10000 });
  const greeting = await this.page.$eval('.greeting', el => el.textContent);
  expect(greeting).toContain(this.newUsername);
});