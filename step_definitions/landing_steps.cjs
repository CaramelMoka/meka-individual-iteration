const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

Given('the visitor opens the application', async function () {
  await this.page.goto('http://localhost:5173');
});

When('the landing page loads', async function () {
  await this.page.waitForSelector('.landing-container');
});

Then('the visitor should see a greeting message', async function () {
  const greeting = await this.page.$eval('.greeting', el => el.textContent);
  expect(greeting).toMatch(/Good/);
  expect(greeting).toMatch(/User/);
});

Then('the visitor should see a prompt input field', async function () {
  const input = await this.page.$('.prompt-input');
  expect(input).toBeTruthy();
});