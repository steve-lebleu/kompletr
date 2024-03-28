import { Configuration } from '../src/js/configuration.js';

describe('Configuration', () => {
  let configuration;

  beforeEach(() => {
    configuration = new Configuration({
      theme: 'light',
      animationType: 'fadeIn',
      animationDuration: 500,
      multiple: false,
      fieldsToDisplay: ['field1', 'field2'],
      maxResults: 10,
      startQueriyngFromChar: 2,
      propToMapAsValue: 'value',
      filterOn: 'prefix',
      cache: 0,
    });
  });

  describe('::constructor', () => {
    it('defines getters and setters for all properties', () => {
      expect(configuration.theme).toBeDefined();
      expect(configuration.animationType).toBeDefined();
      expect(configuration.animationDuration).toBeDefined();
      expect(configuration.multiple).toBeDefined();
      expect(configuration.fieldsToDisplay).toBeDefined();
      expect(configuration.maxResults).toBeDefined();
      expect(configuration.startQueryingFromChar).toBeDefined();
      expect(configuration.propToMapAsValue).toBeDefined();
      expect(configuration.filterOn).toBeDefined();
      expect(configuration.cache).toBeDefined();
    });
  
    it('throws error when setting invalid animationType', () => {
      expect(() => {
        configuration.animationType = 'invalid';
      }).toThrowError(new Error('animation.type should be one of fadeIn,slideDown'));
    });
  
    it('throws error when setting non-integer animationDuration', () => {
      expect(() => {
        configuration.animationDuration = 'not a number';
      }).toThrowError(new Error('animation.duration should be an integer'));
    });
  
    it('throws error when setting invalid theme', () => {
      expect(() => {
        configuration.theme = 'invalid';
      }).toThrowError(new Error('theme should be one of light,dark, invalid given'));
    });
  
    it('throws error when setting invalid filterOn', () => {
      expect(() => {
        configuration.filterOn = 'invalid';
      }).toThrowError(new Error('filterOn should be one of prefix,expression, invalid given'));
    });
  
    it('throws error when setting non-integer cache', () => {
      expect(() => {
        configuration.cache = 'not a number';
      }).toThrowError(new Error('cache should be an integer'));
    });
  });
});
