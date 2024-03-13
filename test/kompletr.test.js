import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

import kompletr from '../src/js/kompletr.js';

describe.only('kompletr', () => {
  let inputElement, parentElement;

  beforeEach(() => {
    const dom = new JSDOM();
    global.document = dom.window.document;
    parentElement = document.createElement('div');
    inputElement = document.createElement('input');
    parentElement.appendChild(inputElement);
    document.body.appendChild(parentElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe.only('::init', () => {
    it.only('should initialize kompletr with provided input, data, options, onKeyup, onSelect, and onError', () => {
      const data = ['apple', 'banana', 'cherry'];
      const options = { startQueriyngFromChar: 3 };
      const onKeyup = jest.fn();
      const onSelect = jest.fn();
      const onError = jest.fn();

      kompletr.init({ input: inputElement, data, options, onKeyup, onSelect, onError });

      expect(kompletr.dom.input).toBe(inputElement);
      expect(kompletr.props.data).toBe(data);
      
      expect(kompletr.options).toBe(options); // Mocking the options object

      expect(kompletr.callbacks.onKeyup).toBe(onKeyup);
      expect(kompletr.callbacks.onSelect).toBe(onSelect);
      expect(kompletr.callbacks.onError).toBe(onError);
    });

    it('should throw an error if input is not provided', () => {
      expect(() => {
        kompletr.init({ data: ['apple', 'banana'] });
      }).toThrow('Input element is required');
    });
  });

  describe.skip('::handlers', () => {
    beforeEach(() => {
      kompletr.dom = {
        input: inputElement,
        result: document.createElement('div'),
        focused: null
      };
      kompletr.props = {
        data: ['apple', 'banana', 'cherry'],
        pointer: -1,
        previousValue: ''
      };
      kompletr.options = {
        startQueriyngFromChar: 3,
        maxResults: 5,
        propToMapAsValue: 'name',
        filterOn: 'prefix'
      };
      kompletr.callbacks = {
        onKeyup: jest.fn(),
        onSelect: jest.fn()
      };
    });

    describe('::hydrate', () => {
      it('should call cache.get if cache is active and valid', async () => {
        kompletr.cache = {
          isActive: jest.fn().mockReturnValue(true),
          isValid: jest.fn().mockResolvedValue(true),
          get: jest.fn()
        };

        await kompletr.handlers.hydrate('app');

        expect(kompletr.cache.isActive).toHaveBeenCalled();
        expect(kompletr.cache.isValid).toHaveBeenCalledWith('app');
        expect(kompletr.cache.get).toHaveBeenCalled();
      });

      it('should call callbacks.onKeyup if it is defined', async () => {
        kompletr.callbacks.onKeyup = jest.fn();

        await kompletr.handlers.hydrate('app');

        expect(kompletr.callbacks.onKeyup).toHaveBeenCalledWith('app', expect.any(Function));
      });

      it('should trigger EventManager.event.dataDone if neither cache nor callbacks.onKeyup are defined', async () => {
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        await kompletr.handlers.hydrate('app');

        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.dataDone, { from: 'local', data: kompletr.props.data });
      });

      it('should trigger EventManager.event.error if an error occurs', async () => {
        const triggerMock = jest.spyOn(EventManager, 'trigger');
        const error = new Error('Something went wrong');

        kompletr.cache = {
          isActive: jest.fn().mockReturnValue(true),
          isValid: jest.fn().mockRejectedValue(error)
        };

        await kompletr.handlers.hydrate('app');

        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.error, error);
      });
    });

    describe('::navigate', () => {
      it('should not change pointer if keyCode is not 38 (Up) or 40 (Down)', () => {
        kompletr.props.pointer = 0;

        kompletr.handlers.navigate(37); // Left

        expect(kompletr.props.pointer).toBe(0);
      });

      it('should not change pointer if it is out of range', () => {
        kompletr.props.pointer = -2;

        kompletr.handlers.navigate(38); // Up

        expect(kompletr.props.pointer).toBe(-2);

        kompletr.props.pointer = 3;

        kompletr.handlers.navigate(40); // Down

        expect(kompletr.props.pointer).toBe(3);
      });

      it('should decrease pointer by 1 if keyCode is 38 (Up)', () => {
        kompletr.props.pointer = 2;

        kompletr.handlers.navigate(38); // Up

        expect(kompletr.props.pointer).toBe(1);
      });

      it('should increase pointer by 1 if keyCode is 40 (Down)', () => {
        kompletr.props.pointer = 1;

        kompletr.handlers.navigate(40); // Down

        expect(kompletr.props.pointer).toBe(2);
      });

      it('should call kompletr.viewEngine.focus with "remove" and "add"', () => {
        kompletr.props.pointer = 1;
        kompletr.viewEngine = {
          focus: jest.fn()
        };

        kompletr.handlers.navigate(38); // Up

        expect(kompletr.viewEngine.focus).toHaveBeenCalledWith(1, 'remove');
        expect(kompletr.viewEngine.focus).toHaveBeenCalledWith(1, 'add');
      });
    });

    describe('::select', () => {
      it('should set input value to selected item and call callbacks.onSelect', () => {
        kompletr.dom.input.value = '';
        kompletr.callbacks.onSelect = jest.fn();

        kompletr.handlers.select(1);

        expect(kompletr.dom.input.value).toBe('banana');
        expect(kompletr.callbacks.onSelect).toHaveBeenCalledWith('banana');
      });

      it('should trigger EventManager.event.selectDone', () => {
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        kompletr.handlers.select(1);

        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.selectDone);
      });
    });
  });

  describe.skip('::listeners', () => {
    beforeEach(() => {
      kompletr.dom = {
        input: inputElement,
        result: document.createElement('div'),
        focused: null
      };
      kompletr.props = {
        pointer: -1
      };
      kompletr.options = {
        animationType: 'fadeIn',
        animationDuration: 500
      };
      kompletr.callbacks = {
        onSelect: jest.fn()
      };
    });

    describe('::onError', () => {
      it('should log the error and call callbacks.onError', () => {
        const consoleErrorMock = jest.spyOn(console, 'error');
        const error = new Error('Something went wrong');

        kompletr.callbacks.onError = jest.fn();

        kompletr.listeners.onError({ detail: error });

        expect(consoleErrorMock).toHaveBeenCalledWith('[kompletr] An error has occured -> Something went wrong');
        expect(kompletr.callbacks.onError).toHaveBeenCalledWith(error);
      });
    });

    describe('::onSelectDone', () => {
      it('should return early if the event target is the input element', () => {
        const animateBackMock = jest.spyOn(Animation, 'animateBack');
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        const event = { srcElement: inputElement };

        kompletr.listeners.onSelectDone(event);

        expect(animateBackMock).not.toHaveBeenCalled();
        expect(triggerMock).not.toHaveBeenCalled();
      });

      it('should call Animation.animateBack and trigger EventManager.event.navigationDone', () => {
        const animateBackMock = jest.spyOn(Animation, 'animateBack');
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        const event = { srcElement: document.createElement('div') };

        kompletr.listeners.onSelectDone(event);

        expect(animateBackMock).toHaveBeenCalledWith(kompletr.dom.result, kompletr.options.animationType, kompletr.options.animationDuration);
        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.navigationDone);
      });
    });

    describe('::onNavigationDone', () => {
      it('should reset pointer to -1', () => {
        kompletr.props.pointer = 2;

        kompletr.listeners.onNavigationDone();

        expect(kompletr.props.pointer).toBe(-1);
      });
    });

    describe('::onDataDone', () => {
      it('should set kompletr.props.data and trigger EventManager.event.renderDone', () => {
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        const data = ['apple', 'banana', 'cherry'];

        kompletr.listeners.onDataDone({ detail: { data } });

        expect(kompletr.props.data).toBe(data);
        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.renderDone);
      });

      it('should filter data based on kompletr.options.filterOn if callbacks.onKeyup is not defined', () => {
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        kompletr.options.filterOn = 'prefix';
        kompletr.dom.input.value = 'b';
        kompletr.props.data = [
          { name: 'apple' },
          { name: 'banana' },
          { name: 'cherry' }
        ];

        kompletr.listeners.onDataDone({ detail: { data: kompletr.props.data } });

        expect(kompletr.props.data).toEqual([{ idx: 1, data: { name: 'banana' } }]);
        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.renderDone);
      });

      it('should set cache if cache is active and not valid', async () => {
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        kompletr.cache = {
          isActive: jest.fn().mockReturnValue(true),
          isValid: jest.fn().mockResolvedValue(false),
          set: jest.fn()
        };

        kompletr.dom.input.value = 'apple';
        kompletr.props.data = ['apple', 'banana', 'cherry'];

        await kompletr.listeners.onDataDone({ detail: { data: kompletr.props.data } });

        expect(kompletr.cache.set).toHaveBeenCalledWith({ string: 'apple', data: kompletr.props.data });
        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.renderDone);
      });
    });

    describe('::onKeyup', () => {
      it('should return early if input value length is less than kompletr.options.startQueriyngFromChar', () => {
        const hydrateMock = jest.spyOn(kompletr.handlers, 'hydrate');
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        kompletr.dom.input.value = 'ap';
        kompletr.options.startQueriyngFromChar = 3;

        const event = { keyCode: 65 }; // 'A'

        kompletr.listeners.onKeyup(event);

        expect(hydrateMock).not.toHaveBeenCalled();
        expect(triggerMock).not.toHaveBeenCalled();
      });

      it('should call kompletr.handlers.select if keyCode is 13 (Enter)', () => {
        const selectMock = jest.spyOn(kompletr.handlers, 'select');

        const event = { keyCode: 13 }; // Enter

        kompletr.listeners.onKeyup(event);

        expect(selectMock).toHaveBeenCalledWith(kompletr.dom.focused.id);
      });

      it('should call kompletr.handlers.navigate if keyCode is 38 (Up) or 40 (Down)', () => {
        const navigateMock = jest.spyOn(kompletr.handlers, 'navigate');

        const event1 = { keyCode: 38 }; // Up
        const event2 = { keyCode: 40 }; // Down

        kompletr.listeners.onKeyup(event1);
        kompletr.listeners.onKeyup(event2);

        expect(navigateMock).toHaveBeenCalledTimes(2);
        expect(navigateMock).toHaveBeenCalledWith(38);
        expect(navigateMock).toHaveBeenCalledWith(40);
      });

      it('should call kompletr.handlers.hydrate if input value has changed', () => {
        const hydrateMock = jest.spyOn(kompletr.handlers, 'hydrate');

        kompletr.dom.input.value = 'app';
        kompletr.props.previousValue = 'ap';

        const event = { keyCode: 65 }; // 'A'

        kompletr.listeners.onKeyup(event);

        expect(hydrateMock).toHaveBeenCalledWith('app');
      });

      it('should trigger EventManager.event.navigationDone', () => {
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        const event = { keyCode: 65 }; // 'A'

        kompletr.listeners.onKeyup(event);

        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.navigationDone);
      });
    });

    describe('::onRenderDone', () => {
      it('should call Animation[kompletr.options.animationType] and add click event listeners to result children', () => {
        const fadeInMock = jest.spyOn(Animation, 'fadeIn');
        const addEventListenerMock = jest.spyOn(kompletr.dom.result.children[0], 'addEventListener');
        const triggerMock = jest.spyOn(EventManager, 'trigger');

        kompletr.dom.result.appendChild(document.createElement('div'));

        kompletr.listeners.onRenderDone();

        expect(fadeInMock).toHaveBeenCalledWith(kompletr.dom.result, kompletr.options.animationDuration);
        expect(addEventListenerMock).toHaveBeenCalledWith('click', expect.any(Function));
        expect(triggerMock).toHaveBeenCalledWith(EventManager.event.renderDone);
      });
    });
  });
});