import { describe, jest } from '@jest/globals';
import { Cache } from '../src/js/kompletr.cache.js';

describe('Cache', () => {
  let cache;

  beforeEach(() => {
    cache = new Cache(1000, 'test.cache');
    window = Object.create(window);
    window.caches = {};
    window.caches.open = jest.fn().mockResolvedValue({
      match: jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue('test data'),
        text: jest.fn().mockResolvedValue(Date.now().toString())
      }),
      put: jest.fn().mockResolvedValue(undefined)
    });
  });

  it('should defines get method', () => {
    expect(cache.get).toBeDefined();
    expect(typeof cache.get).toBe('function');
  });

  it('should defines isActive method', () => {
    expect(cache.isActive).toBeDefined();
    expect(typeof cache.isActive).toBe('function');
  });

  it('should defines isValid method', () => {
    expect(cache.isValid).toBeDefined();
    expect(typeof cache.isValid).toBe('function');
  });

  it('should defines set method', () => {
    expect(cache.set).toBeDefined();
    expect(typeof cache.set).toBe('function');
  });

  describe('::get', () => {
    it('should retrieves data from the cache', done => {
      cache.get('test', data => {
        expect(data).toBe('test data');
        done();
      });
    });
  });
  
  describe('::set', () => {
    it('should puts data into the cache', () => {
      cache.set({ string: 'test', data: 'test data' });
      expect(window.caches.open).toHaveBeenCalled();
    });
  });

  describe('::isActive', () => {
    it('should returns true if duration is not 0', () => {
      expect(cache.isActive()).toBe(true);
    });
  });

  describe('::isValid', () => {
    it('should returns true if cache entry is within its lifetime', async () => {
      expect(await cache.isValid('test')).toBe(true);
    });
  });
});