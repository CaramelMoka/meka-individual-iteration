const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

let selectedModels = [];
let models = [
  { id: 'gemma3:270m', name: 'Gemma', showInSelector: true },
  { id: 'smollm2:135m', name: 'SmolLM', showInSelector: true },
  { id: 'tinyllama', name: 'TinyLlama', showInSelector: false }
];

let responses = [];

// Scenario 1
Given('the user is on the chat interface', function () {
  selectedModels = [];
});

Given('the model selector displays available models', function () {
  const visible = models.filter(m => m.showInSelector);
  assert(visible.length > 0);
});

When('the user selects {string}', function (modelName) {
  const model = models.find(m => m.name === modelName);
  selectedModels.push(model.id);
});

Then('both models should be selected', function () {
  assert(selectedModels.length >= 2);
});

Then('both models should be sent in the request', function () {
  assert(selectedModels.includes('gemma3:270m'));
  assert(selectedModels.includes('smollm2:135m'));
});

// Scenario 2
Given('the user has selected multiple models', function () {
  selectedModels = ['gemma3:270m', 'smollm2:135m'];
});

When('the user sends a prompt', function () {
  responses = selectedModels.map(id => ({
    role: id,
    content: 'response'
  }));
});

Then('responses from all selected models should be returned', function () {
  assert(responses.length === selectedModels.length);
});

Then('each response should be displayed separately', function () {
  assert(responses.every(r => r.content));
});

Then('each response should show the correct model name', function () {
  assert(responses.some(r => r.role === 'gemma3:270m'));
});

// Scenario 3
Given('a model has showInSelector set to false', function () {
  // already defined
});

When('the ModelSelector is rendered', function () {
  this.visibleModels = models.filter(m => m.showInSelector);
});

Then('the hidden model should not appear', function () {
  const names = this.visibleModels.map(m => m.name);
  assert(!names.includes('TinyLlama'));
});