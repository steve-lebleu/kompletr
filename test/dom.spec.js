const dom = new JSDOM('<!doctype html><html><body><input id="input"></body></html>');

global.window = dom.window;
global.document = window.document;
global.document.body.innerHTML = '<input id="input">';

import { describe, jest } from '@jest/globals';
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

  describe('::constructor', () => {
    it('should instanciate correctly the right properties', () => {
      expect(dom._broadcaster).toBe(broadcaster);
      expect(dom.body).toBe(document.body);
      expect(dom.input).toBeInstanceOf(HTMLInputElement);
      expect(dom.result).toBeInstanceOf(HTMLElement);
    });
  
    it('should defines getters and setters for all properties', () => {
      expect(dom.body).toBeDefined();
      expect(dom.result).toBeDefined();
      expect(dom.input).toBeDefined();
      expect(dom.focused).toBeDefined();
    });
  });

  describe('::build', () => {
    it('should build element with right attributes', () => {
      const element = dom.build('div', [{ id: 'test' }, { class: 'test' }]);
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.id).toBe('test');
      expect(element.className).toBe('test');
    });
  });

  describe('::focus', () => {
    it('should manage adding and removing focus', () => {
      dom.result.appendChild(document.createElement('div'));
      dom.focus(0, 'add');
      expect(dom.focused).toBeInstanceOf(HTMLElement);
      expect(dom.focused.className).toContain('focus');
      dom.focus(0, 'remove');
      expect(dom.focused).toBeNull();
      expect(dom.result.firstChild.className).not.toContain('focus');
    });
  });

  describe('::buildResults', () => {
    it('should build well formed DOM with suggestions results', () => {
      const data = [{ idx: '1', data: 'test' }];
      dom.buildResults(data);
      expect(dom.result.firstChild).toBeInstanceOf(HTMLElement);
      expect(dom.result.firstChild.id).toBe('1');
      expect(dom.result.firstChild.className).toBe('item--result');
      expect(dom.result.firstChild.firstChild.className).toBe('item--data');
      expect(dom.result.firstChild.firstChild.textContent).toBe('test');
      expect(broadcaster.trigger).toHaveBeenCalled();
    });
  });
});