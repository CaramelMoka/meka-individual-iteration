const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

Given('the user is logged in', async function () {
  if (!this.testUsername) {
    const username = `logoutuser_${Date.now()}`;
    const password = 'pass123';
    await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    this.testUsername = username;
    this.testPassword = password;
  }
  await this.page.goto('http://localhost:5173');
  await this.page.waitForSelector('.account-icon button');
  await this.page.click('.account-icon button');
  await this.page.waitForSelector('.modal-content');
  await this.page.type('input[placeholder="Username"]', this.testUsername);
  await this.page.type('input[placeholder="Password"]', this.testPassword);
  await this.page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Log In'));
    if (btn) btn.click();
  });
  await this.page.waitForSelector('.modal-content', { hidden: true });
});

When('the user clicks the logout button', async function () {
  await this.page.waitForSelector('.logout-button');
  await this.page.click('.logout-button');
});

Then('the user should be logged out', async function () {
  await this.page.waitForSelector('.account-icon button');
  const loginButton = await this.page.$('.account-icon button');
  expect(loginButton).toBeTruthy();
  const greeting = await this.page.$eval('.greeting', el => el.textContent);
  expect(greeting).toMatch(/User/);
});