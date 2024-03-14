import { describe, jest } from '@jest/globals';

import { Broadcaster } from '../src/js/broadcaster.js';
import { event } from '../src/js/enums.js';

describe('Broadcaster', () => {
  let instance;

  beforeEach(() => {
    instance = new Broadcaster();
  });

  describe('::constructor', () => {
    it('should construct properly', () => {
      expect(instance).toBeInstanceOf(Broadcaster);
    });
  });

  describe('::subscribe', () => {
    it('should subscribe to an event', () => {
      const handler = jest.fn();
      instance.subscribe(event.error, handler);
      expect(instance.subscribers).toEqual([{ type: event.error, handler }]);
    });

    it('should throw an error when subscribing to an invalid event', () => {
      const handler = jest.fn();
      expect(() => instance.subscribe('invalid', handler)).toThrowError();
    });
  });

  describe('::listen', () => {
    it('should listen to an event', () => {
      const element = { addEventListener: jest.fn() };
      const handler = jest.fn();
      instance.listen(element, event.error, handler);
      expect(element.addEventListener).toHaveBeenCalledWith(event.error, handler);
    });
  });

  describe('::trigger', () => {
    it('should trigger an event', () => {
      const handler = jest.fn();
      instance.subscribe(event.error, handler);
      instance.trigger(event.error, { message: 'Test error' });
      expect(handler).toHaveBeenCalledWith({ message: 'Test error' });
    });
  
    it('should throw an error when triggering an invalid event', () => {
      expect(() => instance.trigger('invalid')).toThrowError();
    });
  });
});