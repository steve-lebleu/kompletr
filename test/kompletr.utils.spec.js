import { JSDOM } from 'jsdom';
import { build, uuid } from '../src/js/kompletr.utils.js';

describe('Utils functions', () => {
  describe('::build', () => {
    beforeEach(() => {
      const dom = new JSDOM();
      global.document = dom.window.document;
    });
  
    test('should create an element with no attributes', () => {
      const element = build('div');
      expect(element.tagName).toBe('DIV');
      expect(element.attributes.length).toBe(0);
    });
  
    test('should create an element with attributes', () => {
      const element = build('div', [{ id: 'test' }, { class: 'test-class' }]);
      expect(element.tagName).toBe('DIV');
      expect(element.attributes.length).toBe(2);
      expect(element.getAttribute('id')).toBe('test');
      expect(element.getAttribute('class')).toBe('test-class');
    });
  });
});