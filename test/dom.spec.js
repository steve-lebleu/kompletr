import { JSDOM } from 'jsdom';
import { DOM } from '../src/js/dom.js';

describe('DOM class', () => {
  beforeEach(() => {
    const dom = new JSDOM();
    global.document = dom.window.document;
  });

  test('constructor should initialize properties', () => {
    const inputElement = document.createElement('input');
    inputElement.id = 'test';
    document.body.appendChild(inputElement);

    const dom = new DOM('test', { theme: 'dark' });

    expect(dom.body).toBe(document.body);
    expect(dom.input).toBe(inputElement);
    expect(dom.focused).toBe(null);
    expect(dom.result.id).toBe('kpl-result');
    expect(dom.result.className).toBe('form--search__result');
    expect(inputElement.parentElement.className).toContain('kompletr dark');
  });

  test('getter/setter methods should get and set properties', () => {
    const dom = new DOM('test');

    const newBody = document.createElement('body');
    dom.body = newBody;
    expect(dom.body).toBe(newBody);

    const newInput = document.createElement('input');
    dom.input = newInput;
    expect(dom.input).toBe(newInput);

    const newFocused = document.createElement('div');
    dom.focused = newFocused;
    expect(dom.focused).toBe(newFocused);

    const newResult = document.createElement('div');
    dom.result = newResult;
    expect(dom.result).toBe(newResult);
  });
});
