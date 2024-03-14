const dom = new JSDOM('<!doctype html><html><body><input id="input"></body></html>');

global.window = dom.window;
global.document = window.document;
global.document.body.innerHTML = '<input id="input">';

import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { DOM } from '../src/js/dom.js';

describe('DOM', () => {
  let dom;
  let broadcaster = {
    trigger: jest.fn()
  };

  beforeEach(() => {
    dom = new DOM('input', broadcaster)
  });

  test('constructor', () => {
    expect(dom._broadcaster).toBe(broadcaster);
    expect(dom._body).toBe(document.body);
    expect(dom._input).toBeInstanceOf(HTMLInputElement);
    expect(dom._result).toBeInstanceOf(HTMLElement);
  });

  it('defines getters and setters for all properties', () => {
    expect(dom.body).toBeDefined();
    expect(dom.result).toBeDefined();
    expect(dom.input).toBeDefined();
    expect(dom.focused).toBeDefined();
  });

  test('build', () => {
    const element = dom.build('div', [{ id: 'test' }, { class: 'test' }]);
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.id).toBe('test');
    expect(element.className).toBe('test');
  });

  test('focus', () => {
    dom._result.appendChild(document.createElement('div'));
    dom.focus(0, 'add');
    expect(dom._focused).toBeInstanceOf(HTMLElement);
    expect(dom._focused.className).toContain('focus');
    dom.focus(0, 'remove');
    expect(dom._focused).toBeNull();
    expect(dom._result.firstChild.className).not.toContain('focus');
  });

  test('buildResults', () => {
    const data = [{ idx: '1', data: 'test' }];
    dom.buildResults(data);
    expect(dom._result.firstChild).toBeInstanceOf(HTMLElement);
    expect(dom._result.firstChild.id).toBe('1');
    expect(dom._result.firstChild.className).toBe('item--result');
    expect(dom._result.firstChild.firstChild.className).toBe('item--data');
    expect(dom._result.firstChild.firstChild.textContent).toBe('test');
    expect(broadcaster.trigger).toHaveBeenCalledWith('kompletr.dom.done');
  });
});