const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

let models = [];
let selectedModels = [];

// ---------- J1 ----------

Given('the model management panel is loaded', function () {
  models = [
    { id: 'A', name: 'Model A', showInSelector: true },
    { id: 'B', name: 'Model B', showInSelector: true }
  ];
});

Then('I should see {string}', function (modelName) {
  const names = models.map(m => m.name);
  assert(names.includes(modelName));
});

// ---------- J2 ----------

Given('the model management panel is loaded with {string} selected', function (modelName) {
  models = [
    { id: 'A', name: 'Model A', showInSelector: true },
    { id: 'B', name: 'Model B', showInSelector: true }
  ];

  const model = models.find(m => m.name === modelName);
  selectedModels = [model.id];
});

When('I toggle {string}', function (modelName) {
  const model = models.find(m => m.name === modelName);

  // 模拟 toggleVisibility
  model.showInSelector = !model.showInSelector;

  // 同步删除 selected
  selectedModels = selectedModels.filter(id => id !== model.id);
});

Then('{string} should be removed from selected models', function (modelName) {
  const model = models.find(m => m.name === modelName);
  assert(!selectedModels.includes(model.id));
});