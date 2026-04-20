const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

Given('a registered user exists', { timeout: 30000 }, async function () {
  const username = `testuser_${Date.now()}`;
  const password = 'pass123';
  await fetch('http://localhost:3001/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  this.testUsername = username;
  this.testPassword = password;
  await this.page.goto('http://localhost:5173');
  await this.page.waitForSelector('.account-icon button');
});

When('the user enters valid login credentials', async function () {
  await this.page.click('.account-icon button');
  await this.page.waitForSelector('.modal-content');
  await this.page.type('input[placeholder="Username"]', this.testUsername);
  await this.page.type('input[placeholder="Password"]', this.testPassword);
  await this.page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Log In'));
    if (btn) btn.click();
  });
});

Then('the user should access the interface', async function () {
  await this.page.waitForSelector('.modal-content', { hidden: true, timeout: 10000 });
  const greeting = await this.page.$eval('.greeting', el => el.textContent);
  expect(greeting).toContain(this.testUsername);
});