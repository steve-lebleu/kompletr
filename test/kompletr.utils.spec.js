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

  describe('::uuid', () => {
    test('should return a unique identifier for a given string', () => {
      const id1 = uuid('test');
      const id2 = uuid('test');
      const id3 = uuid('different');

      // The generated id should be the same for the same input
      expect(id1).toBe(id2);

      // Different input should (in most cases) result in a different id
      expect(id1).not.toBe(id3);
    });
  });
});