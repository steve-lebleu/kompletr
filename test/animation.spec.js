import { JSDOM } from 'jsdom';
import { Animation } from '../src/js/animation.js';

describe('Animation', () => {
  let dom;
  let element;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><p>Hello world</p></body></html>`);
    element = dom.window.document.querySelector('p');
  });

  it('fadeIn changes the style of the element', () => {
    Animation.fadeIn(element);
    setTimeout(() => {
      expect(element.style.opacity).toBe('1');
      expect(element.style.display).toBe('block');
    }, 500);
  });

  it('fadeOut changes the style of the element', () => {
    Animation.fadeOut(element);
    setTimeout(() => {
      expect(element.style.opacity).toBe('0');
      expect(element.style.display).toBe('none');
    }, 500);
  });
});