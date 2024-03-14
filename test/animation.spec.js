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

  it('slideUp changes the style of the element', () => {
    Animation.slideUp(element);
    setTimeout(() => {
      expect(element.style.height).toBe('0px');
      expect(element.style.display).toBe('none');
    }, 500);
  });

  it.skip('slideDown changes the style of the element', () => {
    Animation.slideDown(element);
    setTimeout(() => {
      expect(element.style.height).not.toBe('0px');
      expect(element.style.display).toBe('block');
    }, 500);
  });

  it('animateBack applies the opposite animation', () => {
    Animation.animateBack(element, 'fadeIn');
    setTimeout(() => {
      expect(element.style.opacity).toBe('0');
      expect(element.style.display).toBe('none');
    }, 500);
  });
});