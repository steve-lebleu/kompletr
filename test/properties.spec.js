import { Properties } from '../src/js/properties.js';

describe('Properties', () => {
  let properties;

  beforeEach(() => {
    properties = new Properties({ data: ['test1', 'test2', 'test3'] });
  });

  it('should defines data getter and setter', () => {
    expect(properties.data).toBeDefined();
    properties.data = ['test4', 'test5'];
    expect(properties.data).toEqual(['test4', 'test5']);
  });

  it('should throws error when setting data with non-array value', () => {
    expect(() => {
      properties.data = 'not an array';
    }).toThrowError(new Error('data must be an array (not an array given)'));
  });

  it('should defines pointer getter and setter', () => {
    expect(properties.pointer).toBeDefined();
    properties.pointer = 1;
    expect(properties.pointer).toBe(1);
  });

  it('should throws error when setting pointer with non-integer value', () => {
    expect(() => {
      properties.pointer = 'not an integer';
    }).toThrowError(new Error('pointer must be an integer (not an integer given)'));
  });

  it('should defines previousValue getter and setter', () => {
    expect(properties.previousValue).toBeDefined();
    properties.previousValue = 'test value';
    expect(properties.previousValue).toBe('test value');
  });
});
