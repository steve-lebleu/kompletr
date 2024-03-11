import { JSDOM } from 'jsdom';
import { Validation } from '../src/js/kompletr.validation.js';

describe('Validation class and methods', () => {
    beforeEach(() => {
      const dom = new JSDOM();
      global.document = dom.window.document;
    });

    describe('::input', () => {
      test('input method should validate HTMLInputElement or DOM eligible', () => {
        const element = document.createElement('input');
        element.id = 'test';
        document.body.appendChild(element);
  
        expect(() => Validation.input('test')).not.toThrow();
        expect(() => Validation.input(element)).not.toThrow();
        expect(() => Validation.input('not-exist')).toThrow();
      });
    });

    describe('::data', () => {
      test('data method should validate array', () => {
        expect(() => Validation.data([1, 2, 3])).not.toThrow();
        expect(() => Validation.data('not-array')).toThrow();
      });
    });

    describe('::callbacks', () => {
      test('callbacks method should validate callbacks object', () => {
        const callbacks = {
          onKeyup: () => {},
          onSelect: () => {},
          onError: () => {},
        };
  
        expect(() => Validation.callbacks(callbacks)).not.toThrow();
        expect(() => Validation.callbacks({ notValid: () => {} })).toThrow();
        expect(() => Validation.callbacks({ onKeyup: 'not-function' })).toThrow();
      });
    });

    describe('::validate', () => {
      test('validate method should validate input, data, and callbacks', () => {
        const element = document.createElement('input');
        element.id = 'test';
        document.body.appendChild(element);
  
        const data = [1, 2, 3];
  
        const callbacks = {
            onKeyup: () => {},
            onSelect: () => {},
            onError: () => {},
        };
  
        expect(() => Validation.validate('test', data, callbacks)).not.toThrow();
        expect(() => Validation.validate('not-exist', data, callbacks)).toThrow();
        expect(() => Validation.validate('test', 'not-array', callbacks)).toThrow();
        expect(() => Validation.validate('test', data, { notValid: () => {} })).toThrow();
      });
    });
});
