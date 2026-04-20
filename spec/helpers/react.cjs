// Mock CSS imports – MUST come before Babel register
const Module = require('module');
if (!Module._extensions['.css']) {
  Module._extensions['.css'] = function(module, filename) {
    module.exports = {};
  };
}

// Register Babel to transpile JSX and ES modules to CommonJS
require('@babel/register')({
  presets: [
    ['@babel/preset-env', { modules: 'commonjs' }], // transforms import to require
    '@babel/preset-react'
  ],
  extensions: ['.js', '.jsx', '.cjs']
});

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Default fetch that rejects (simulates network error)
const defaultFetch = () => Promise.reject(new Error('Network error (default mock)'));

global.fetch = defaultFetch;
global.window.fetch = defaultFetch;
// Make React Testing Library's screen available globally (optional)
const { screen } = require('@testing-library/react');
global.screen = screen;

console.log('Test helper loaded, fetch defined:', typeof global.window.fetch);