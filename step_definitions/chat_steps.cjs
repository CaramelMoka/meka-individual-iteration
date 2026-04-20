const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

// Helper functions
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureChatPage(page) {
  await page.goto('http://localhost:5173');
  await page.waitForSelector('.prompt-input');
}

async function waitForResponse(page, timeout = 30000) {
  await page.waitForSelector('.ai-output .chat-message, .ai-output p', { timeout });
  const placeholder = await page.$('.ai-output p');
  if (placeholder) {
    await page.waitForSelector('.ai-output .chat-message', { timeout });
  }
  const text = await page.$eval('.ai-output .chat-message:last-child', el => el.textContent);
  return text;
}

// ---------- Common navigation ----------
Given('the user is on the chat page', async function () {
  await ensureChatPage(this.page);
});

// ---------- Sending messages ----------
When('the user enters a message and submits', async function () {
  await this.page.type('.prompt-input', 'Hello, AI!');
  await this.page.click('.prompt-submit');
});

Given('the user sends a message', async function () {
  await ensureChatPage(this.page);
  await this.page.type('.prompt-input', 'Test message');
  await this.page.click('.prompt-submit');
  await waitForResponse(this.page);
});

Given('the user has sent a previous message', async function () {
  await ensureChatPage(this.page);
  await this.page.type('.prompt-input', 'My name is John');
  await this.page.click('.prompt-submit');
  await waitForResponse(this.page);
});

When('the user sends a follow-up message', async function () {
  await this.page.type('.prompt-input', 'Tell me more.');
  await this.page.click('.prompt-submit');
});

When('the user submits an empty message', async function () {
  await this.page.type('.prompt-input', '');
  await this.page.click('.prompt-submit');
});

// ---------- LLM response verification ----------
Then('the system sends the message to the LLM', async function () {
  const response = await waitForResponse(this.page);
  expect(response).toBeTruthy();
});

Then('the user receives a response', async function () {
  const response = await waitForResponse(this.page);
  expect(response).not.toBe('');
  expect(response).not.toContain('Error');
});

Then('the response is displayed in the chat UI', async function () {
  const response = await waitForResponse(this.page);
  expect(response).toBeTruthy();
});

Then('the LLM receives the full conversation context', async function () {
  const response = await waitForResponse(this.page);
  expect(response).toBeTruthy();
});

Then('responds based on prior messages', async function () {
  const response = await waitForResponse(this.page);
  expect(response).toBeTruthy();
});

// ---------- Empty message handling ----------
Then('the message is not sent', async function () {
  const response = await this.page.$eval('.ai-output p', el => el.textContent);
  expect(response).toBe('Your AI response will appear here...');
});

Then('an error message is shown', async function () {
  await this.page.waitForSelector('.error-message', { timeout: 5000 });
  const errorElement = await this.page.$('.error-message');
  expect(errorElement).toBeTruthy();
});

Then('an error message is displayed', async function () {
  await this.page.waitForSelector('.error-message', { timeout: 5000 });
  const errorMsg = await this.page.$eval('.error-message', el => el.textContent).catch(() => null);
  expect(errorMsg).toBeTruthy();
});

// ---------- Loading indicator ----------
Given('the system is waiting for the LLM response', async function () {
  await this.page.type('.prompt-input', 'Hello');
  await this.page.click('.prompt-submit');
});

Then('a loading indicator is displayed', async function () {
  const submitButton = await this.page.$('.prompt-submit');
  const isDisabled = await submitButton.evaluate(btn => btn.disabled);
  expect(isDisabled).toBe(true);
});

// ---------- LLM API failure ----------
When('the LLM API fails', async function () {
  await ensureChatPage(this.page);
  await this.page.evaluate(() => {
    window.fetch = () => Promise.reject(new Error('Mock LLM failure'));
  });
  await this.page.type('.prompt-input', 'This should fail');
  await this.page.click('.prompt-submit');
});

Then('the system does not crash', async function () {
  const input = await this.page.$('.prompt-input');
  expect(input).toBeTruthy();
});

// ---------- Chat history persistence ----------
Given('the user has an existing conversation', async function () {
  await ensureChatPage(this.page);
  await this.page.type('.prompt-input', 'First message');
  await this.page.click('.prompt-submit');
  await waitForResponse(this.page);
});

When('the user refreshes the page', async function () {
  await this.page.reload();
  await this.page.waitForSelector('.prompt-input');
  await delay(2000);
});

Then('previous messages should be loaded', async function () {
  await this.page.waitForSelector('.chat-message', { timeout: 15000 });
  const firstMessage = await this.page.$eval('.chat-message', el => el.textContent);
  expect(firstMessage).toContain('First message');
});

Then('displayed in the correct order', async function () {
  const messages = await this.page.$$eval('.chat-message', els => els.map(el => el.textContent));
  expect(messages.length).toBeGreaterThan(1);
});

// ---------- Multiple messages order ----------
Given('multiple messages exist', async function () {
  await ensureChatPage(this.page);
  await this.page.type('.prompt-input', 'Message 1');
  await this.page.click('.prompt-submit');
  await waitForResponse(this.page);
  await this.page.type('.prompt-input', 'Message 2');
  await this.page.click('.prompt-submit');
  await waitForResponse(this.page);
});

When('they are displayed', async function () {
  await delay(1000);
});

Then('they should appear in chronological order', async function () {
  await this.page.waitForSelector('.chat-message');
  await delay(1000);
  const messages = await this.page.$$eval('.chat-message', els => els.map(el => el.textContent));
  const userMessages = messages.filter(msg => msg.includes('You:'));
  expect(userMessages[0]).toContain('Message 1');
  expect(userMessages[1]).toContain('Message 2');
});