import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><input id="input"></body></html>');

global.window = dom.window;
global.document = window.document;
global.document.body.innerHTML = '<div><input id="input"></div>';

import { afterEach, expect, jest } from '@jest/globals';
import kompletr from '../src/js/index.js';

describe('kompletr', () => {
  let mockData;
  let mockOptions;
  let mockCallbacks;

  beforeEach(() => {
    mockData = {};
    mockOptions = { cache: 0 };
    mockCallbacks = {
      onKeyup: jest.fn(),
      onSelect: jest.fn(),
      onError: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  }); 

  it('should initialize all components correctly', () => {
    kompletr({ input: 'input', data: mockData, options: mockOptions, ...mockCallbacks });
    expect(kompletr).toBeInstanceOf(Function);
  });

  it('should put kompletr as prototype of input element', () => {
    expect(window.HTMLInputElement.prototype.kompletr).toBeDefined();
  });
});