import { Options } from '../src/js/kompletr.options.js';

describe('Options', () => {
  let options;

  beforeEach(() => {
    
    options = new Options({
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

  it('defines getters and setters for all properties', () => {
    expect(options.theme).toBeDefined();
    expect(options.animationType).toBeDefined();
    expect(options.animationDuration).toBeDefined();
    expect(options.multiple).toBeDefined();
    expect(options.fieldsToDisplay).toBeDefined();
    expect(options.maxResults).toBeDefined();
    expect(options.startQueriyngFromChar).toBeDefined();
    expect(options.propToMapAsValue).toBeDefined();
    expect(options.filterOn).toBeDefined();
    expect(options.cache).toBeDefined();
  });

  it('throws error when setting invalid animationType', () => {
    expect(() => {
      options.animationType = 'invalid';
    }).toThrowError(new Error('animation.type should be one of fadeIn,slideDown'));
  });

  it('throws error when setting non-integer animationDuration', () => {
    expect(() => {
      options.animationDuration = 'not a number';
    }).toThrowError(new Error('animation.duration should be an integer'));
  });

  it('throws error when setting invalid theme', () => {
    expect(() => {
      options.theme = 'invalid';
    }).toThrowError(new Error('theme should be one of light,dark, invalid given'));
  });

  it('throws error when setting invalid filterOn', () => {
    expect(() => {
      options.filterOn = 'invalid';
    }).toThrowError(new Error('filterOn should be one of prefix,expression, invalid given'));
  });

  it('throws error when setting non-integer cache', () => {
    expect(() => {
      options.cache = 'not a number';
    }).toThrowError(new Error('cache should be an integer'));
  });
});
