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

    it('should throws error when attempt to set input with something else than HTMLInputElement', () => {
      try {
        dom.input = 'test';
      } catch(e) {
        expect(e.message).toBe('input should be an HTMLInputElement instance: test given.');
      }
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
      dom.result.appendChild(document.createElement('div'));
      dom.result.appendChild(document.createElement('div'));
      dom.focus(1);
      expect(dom.focused).toBeInstanceOf(HTMLElement);
      expect(dom.focused.className).toContain('focus');
    });

    it('should throws error when the pointer is out of range', () => {
      try {
        dom.focus(-1);
      } catch(e) {
        expect(e.message).toBe('pointer should be a valid integer in the result lenght range: -1 given.');
      }
    });
  });

  describe('::buildResults', () => {
    it('should build well formed DOM with suggestions results as strings', () => {
      const data = [{ idx: '1', data: 'test' }];
      dom.buildResults(data);
      expect(dom.result.firstChild).toBeInstanceOf(HTMLElement);
      expect(dom.result.firstChild.id).toBe('1');
      expect(dom.result.firstChild.className).toBe('item--result');
      expect(dom.result.firstChild.firstChild.className).toBe('item--data');
      expect(dom.result.firstChild.firstChild.textContent).toBe('test');
      expect(broadcaster.trigger).toHaveBeenCalled();
    });

    it('should build well formed DOM with suggestions results as object', () => {
      const data = [{ idx: '1', data: { prop: 'test'} }];
      dom.buildResults(data, ['prop']);
      expect(dom.result.firstChild).toBeInstanceOf(HTMLElement);
      expect(dom.result.firstChild.id).toBe('1');
      expect(dom.result.firstChild.className).toBe('item--result');
      expect(dom.result.firstChild.firstChild.className).toBe('item--data');
      expect(dom.result.firstChild.firstChild.textContent).toBe('test');
      expect(broadcaster.trigger).toHaveBeenCalled();
    });

    it('should build with a not found when no result', () => {
      dom.buildResults([]);
      expect(dom.result.innerHTML).toContain('Not found');
      expect(broadcaster.trigger).toHaveBeenCalled();
    });
  });
});