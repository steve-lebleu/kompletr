import { jest } from '@jest/globals';

import Kompletr from '../src/js/kompletr.js';

describe('Kompletr', () => {
  let instance;
  let mockBroadcaster;
  let mockDom;
  let mockCache;
  let mockCallbacks;

  // Mock with real mocks better than copilot hé hé
  beforeEach(() => {
    mockBroadcaster = {
      subscribe: jest.fn(),
      listen: jest.fn(),
      trigger: jest.fn(),
    };

    mockDom = {
      input: { value: 'test' },
      body: {},
      result: { children: [] },
      buildResults: jest.fn(),
      focus: jest.fn(),
    };

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

  test('constructor', () => {
    expect(instance.broadcaster).toBe(mockBroadcaster);
    expect(instance.dom).toBe(mockDom);
    expect(mockBroadcaster.subscribe).toHaveBeenCalledTimes(4);
    expect(mockBroadcaster.listen).toHaveBeenCalledTimes(2);
  });

  test('closeTheShop', () => {
    const mockEvent = { srcElement: {} };
    instance.closeTheShop(mockEvent);
    expect(mockDom.result).toBeUndefined();
  });

  test('resetPointer', () => {
    instance.props.pointer = 5;
    instance.resetPointer();
    expect(instance.props.pointer).toBe(-1);
  });

  test('error', () => {
    const mockError = new Error('Test error');
    console.error = jest.fn();
    instance.error(mockError);
    expect(console.error).toHaveBeenCalledWith(`[kompletr] An error has occured -> ${mockError.stack}`);
    expect(mockCallbacks.onError).toHaveBeenCalledWith(mockError);
  });

  test('showResults', async () => {
    const mockData = ['test1', 'test2'];
    await instance.showResults({ from: 'test', data: mockData });
    expect(mockDom.buildResults).toHaveBeenCalled();
  });

  test('bindResults', () => {
    instance.bindResults();
    expect(mockBroadcaster.listen).toHaveBeenCalledTimes(2);
  });

  test('suggest', () => {
    const mockEvent = { keyCode: 13 };
    instance.suggest(mockEvent);
    expect(mockCallbacks.onSelect).toHaveBeenCalled();
  });

  test('hydrate', async () => {
    await instance.hydrate('test');
    expect(mockBroadcaster.trigger).toHaveBeenCalled();
  });

  test('navigate', () => {
    const mockEvent = { keyCode: 38 };
    instance.navigate(mockEvent);
    expect(mockDom.focus).toHaveBeenCalled();
  });

  test('select', () => {
    instance.props.data = ['test1', 'test2'];
    instance.select(1);
    expect(mockCallbacks.onSelect).toHaveBeenCalledWith('test2');
  });
});