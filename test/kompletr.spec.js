import { describe, expect, it, jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div><input id="input"></div></body></html>');

global.window = dom.window;
global.document = window.document;
global.document.body.innerHTML = '<div><input id="input"></div>';

import { DOM } from '../src/js/dom.js';
import Kompletr from '../src/js/kompletr.js';

describe('Kompletr', () => {
  let instance;
  let mockBroadcaster;
  let mockDom;
  let mockCache;
  let mockCallbacks;

  beforeEach(() => {

    mockBroadcaster = {
      subscribers: [],
      subscribe: jest.fn().mockImplementation(function(callback){
        this.subscribers.push(jest.fn());
      }),
      listen: jest.fn().mockImplementation((element, type, handler) => {
        element.addEventListener(type, handler);
      }),
      trigger: jest.fn().mockImplementation(function(type, detail){
        this.subscribers
          .filter(subscriber => subscriber.type === type)
          .forEach(subscriber => subscriber.handler(detail));
      })
    };

    let dom = new DOM('input', mockBroadcaster);

    dom.build = jest.fn();
    dom.buildResults = jest.fn();
    dom.focus = jest.fn();

    mockDom = dom;

    mockCache = {
      isValid: jest.fn().mockResolvedValue(false),
      get: jest.fn(),
      set: jest.fn(),
    };

    mockCallbacks = {
      onKeyup: jest.fn(),
      onSelect: jest.fn(),
      onError: jest.fn(),
    };

    instance = new Kompletr({
      configuration: {},
      properties: {},
      dom: mockDom,
      cache: mockCache,
      broadcaster: mockBroadcaster,
      ...mockCallbacks,
    });
  });

  afterEach(() => {    
    jest.clearAllMocks();
  });

  describe('::constructor', () => {
    it('should construct the Kompletr instance with the right dependencies', () => {
      expect(instance.broadcaster).toBe(mockBroadcaster);
      expect(instance.dom).toBe(mockDom);
      expect(mockBroadcaster.subscribe).toHaveBeenCalledTimes(5);
      expect(mockBroadcaster.listen).toHaveBeenCalledTimes(2);
    });

    xit('should broadcast the error if something bad happens during instanciation', () => {
      console.error = jest.fn().mockImplementation((message) => {});
      mockBroadcaster.subscribe.mockRejectedValue(new Error('Test error'));
      new Kompletr({ broadcaster: mockBroadcaster });
      expect(instance.broadcaster.trigger).toHaveBeenCalledWith('kompletr.error', new Error('Test error'));
    });

    it('should log error if something bad happens during instanciation and the broadcaster is not available', () => {
      console.error = jest.fn().mockImplementation((message) => {});
      new Kompletr({});
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('::closeTheShop', () => {
    it('should do nothing when the event is fired by focusing the input', () => {
      const mockEvent = { srcElement: instance.dom.input };
      const spy = jest.spyOn(instance, 'resetPointer');
      instance.closeTheShop(mockEvent);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should reset the pointer value to -1 by calling resetPointer', () => {
      const mockEvent = { srcElement: {} };
      const spy = jest.spyOn(instance, 'resetPointer');
      instance.closeTheShop(mockEvent);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('::resetPointer', () => {
    it('should reset the pointer value to -1', () => {
      instance.props.pointer = 5;
      instance.resetPointer();
      expect(instance.props.pointer).toBe(-1);
    });
  });

  describe('::error', () => {
    it('should log error in the console and call error callback', () => {
      const mockError = new Error('Test error');
      console.error = jest.fn();
      instance.error(mockError);
      expect(console.error).toHaveBeenCalledWith(`[kompletr] An error has occured -> ${mockError.stack}`);
      expect(mockCallbacks.onError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('::filter', () => {
    it('should filter on prefix and returns 3/7 entries', () => {
      const mockData = ['test1', 'test2', 'test3', 'fest1', 'fest2', 'fest3', 'falsy'].map((record, idx) => ({ idx, data: record }) ); // The map is to simulate an array of objects, like done in the showResults method
      instance.configuration.filterOn = 'prefix';
      const result = instance.filter(mockData, 'test');
      expect(result.length).toBe(3);
    });

    it('should filter on expression and returns 6/7 entries', () => {
      const mockData = ['test1', 'test2', 'test3', 'fest1', 'fest2', 'fest3', 'falsy'].map((record, idx) => ({ idx, data: record }) );  // The map is to simulate an array of objects, like done in the showResults method
      instance.configuration.filterOn = 'expression';
      const result = instance.filter(mockData, 'est');
      expect(result.length).toBe(6);
    });
  });

  describe('::showResults', () => {
    it('should filter the results when no callback out of the box', async () => {
      const spy = jest.spyOn(instance, 'filter');
      const mockData = ['test1', 'test2', 'test3', 'falsy'];
      instance.callbacks.onKeyup = undefined;
      await instance.showResults({ from: 'local', data: mockData });
      expect(spy).toHaveBeenCalled();
    });

    it('should put the data in cache when cache is active and current data is not coming from cache', async () => {
      const mockData = ['test1', 'test2'];
      await instance.showResults({ from: 'test', data: mockData });
      expect(mockCache.set).toHaveBeenCalled();
    });

    it('should call the dom.buildResults method', async () => {
      const mockData = ['test1', 'test2'];
      await instance.showResults({ from: 'test', data: mockData });
      expect(mockDom.buildResults).toHaveBeenCalled();
    });
  });

  describe('::bindResults', () => {
    it('should call the broadcaster.listen method 2 times', () => {
      instance.bindResults();
      expect(mockBroadcaster.listen).toHaveBeenCalledTimes(2);
    });
  });

  describe('::suggest', () => {
    it('should not suggest when input length value is smaller than configuration.startQueryingFromChar', () => {
      const spy = jest.spyOn(instance, 'hydrate');
      instance.configuration.startQueryingFromChar = 10;
      instance.suggest({ keyCode: 12 });
      expect(mockCache.get).not.toHaveBeenCalled();
      expect(mockCallbacks.onKeyup).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should select an entry when Enter is pressed', () => {
      const focused = document.createElement('div');
      focused.id = 0;
      instance.dom.focused = focused;
      instance.props.data = ['test1', 'test2'];
      const mockEvent = { keyCode: 13 };
      const spy = jest.spyOn(instance, 'select');
      instance.suggest(mockEvent);
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate in results when arrow up is pressed', () => {
      const mockEvent = { keyCode: 38 };
      const spy = jest.spyOn(instance, 'navigate');
      instance.suggest(mockEvent);
      expect(spy).toHaveBeenCalled();
    }); 

    it('should navigate in results when arrow down is pressed', () => {
      const mockEvent = { keyCode: 40 };
      const spy = jest.spyOn(instance, 'navigate');
      instance.suggest(mockEvent);
      expect(spy).toHaveBeenCalled();
    }); 

    it('should request data when another key is pressed and input value has changed', () => {
      const mockEvent = { keyCode: 12 };
      const spy = jest.spyOn(instance, 'hydrate');
      instance.suggest(mockEvent);
      expect(spy).toHaveBeenCalled();
    });

    it('should not request data when another key is pressed and input value has not changed', () => {
      instance.dom.input.value = 'test';
      instance.props.previousValue = 'test';
      const mockEvent = { keyCode: 12 };
      const spy = jest.spyOn(instance, 'hydrate');
      instance.suggest(mockEvent);
      expect(spy).not.toHaveBeenCalled();
    });
  });
  
  describe('::hydrate', () => {
    it('should request data from cache if it is valid', async () => {
      mockCache.isValid.mockResolvedValue(true);
      await instance.hydrate('test');
      expect(mockCache.get).toHaveBeenCalled();
    });

    it('should request data from callback when onKeyup callback exists', async () => {
      mockCache.isValid.mockResolvedValue(false);
      await instance.hydrate('test');
      expect(mockCache.get).not.toHaveBeenCalled();
      expect(mockCallbacks.onKeyup).toHaveBeenCalled();
    });

    it('should request data from props when she\'s not provided from cache or callback', async () => {
      mockCache.isValid.mockResolvedValue(false);
      instance.props.data = ['test1', 'test2'];
      instance.callbacks.onKeyup = undefined;
      await instance.hydrate('test');
      expect(mockCache.get).not.toHaveBeenCalled();
      expect(mockCallbacks.onKeyup).not.toHaveBeenCalled();
    });

    it('should broadcast the data when she\'s available from cache', async () => {
      instance.cache.isValid = jest.fn().mockImplementation(async (value) => {
        return true
      });
      instance.cache.get = jest.fn().mockImplementation((value, callback) => {
        callback(['test1', 'test2']);
      });
      await instance.hydrate('test');
      expect(mockBroadcaster.trigger).toHaveBeenCalledWith('kompletr.data.done', { from: 'cache', data: ['test1', 'test2'] });
    });

    it('should broadcast the data when she\'s available from callback', async () => {
      mockCache.isValid.mockResolvedValue(false);
      instance.callbacks.onKeyup = jest.fn().mockImplementation((value, callback) => {
        callback(['test1', 'test2']);
      });
      await instance.hydrate('test');
      expect(mockBroadcaster.trigger).toHaveBeenCalledWith('kompletr.data.done', { from: 'callback', data: ['test1', 'test2'] });
    });

    it('should broadcast the data when she\'s available from props', async () => {
      mockCache.isValid.mockResolvedValue(false);
      instance.callbacks.onKeyup = undefined;
      instance.props.data = ['test1', 'test2'];
      await instance.hydrate('test');
      expect(mockBroadcaster.trigger).toHaveBeenCalledWith('kompletr.data.done', { from: 'local', data: ['test1', 'test2'] });
    });

    xit('should trigger error when an error occurs', async () => {
      mockCache.isValid.mockResolvedValue(true);
      mockCache.get.mockRejectedValue(new Error('Test error'));
      await instance.hydrate('test');
      expect(mockBroadcaster.trigger).toHaveBeenCalled;
    });
  });

  describe('::navigate', () => {
    it('should do nothing when key code is not up / down arrow', () => {
      instance.navigate(12);
      expect(mockDom.focus).not.toHaveBeenCalled();
    }); 

    it('should do nothing when pointer is out of range', () => {
      instance.props.pointer = -2
      instance.navigate(38);
      expect(instance.props.pointer).toBe(-2);
      expect(mockDom.focus).not.toHaveBeenCalled();
    }); 

    it('should move up the pointer', () => {
      instance.props.pointer = 2;
      instance.dom.result = { children: [1, 2, 3, 4, 5] };
      instance.navigate(40);
      expect(instance.props.pointer).toBe(3);
    }); 

    it('should move down the pointer', () => {
      instance.props.pointer = 2;
      instance.dom.result = { children: [1, 2, 3, 4, 5] };
      instance.navigate(38);
      expect(instance.props.pointer).toBe(1);
    });

    it('should update the focus by calling dom.focus method', () => {
      const spy = jest.spyOn(mockDom, 'focus');
      instance.props.pointer = 2;
      instance.dom.result = { children: [1, 2, 3, 4, 5] };
      instance.navigate(38);
      expect(spy).toHaveBeenCalledWith(1, 'add');
      expect(spy).toHaveBeenCalledWith(1, 'remove');
    });
  });

  describe('::select', () => {
    it('should assign the right value as string on the input', () => {
      instance.props.data = ['test1', 'test2'];
      instance.select(1);
      expect(instance.dom.input.value).toBe('test2');
    });

    it('should assign the right value as object property on the input', () => {
      instance.configuration.propToMapAsValue = 'prop';
      instance.props.data = [{ prop: 'test1' }];
      instance.select(0);
      expect(instance.dom.input.value).toBe('test1');
    });

    it('should call onSelect callback with the selected value', () => {
      instance.props.data = ['test1', 'test2'];
      instance.select(1);
      expect(mockCallbacks.onSelect).toHaveBeenCalledWith('test2');
    });

    it('should broadcast select.done', () => {
      instance.props.data = ['test1', 'test2'];
      instance.select(1);
      expect(mockBroadcaster.trigger).toHaveBeenCalledWith('kompletr.select.done');
    });
  });
});