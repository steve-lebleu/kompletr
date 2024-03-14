import { animation } from "./enums.js";

/**
 * Represents an Animation class that provides various animation effects.
 */
export class Animation {
  constructor() {}

  /**
   * Apply a fadeIn animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * @param {String} display - The CSS3 display property value.
   * @param {Number} duration - The duration of the animation in milliseconds.
   * 
   * @returns {Void}
   * 
   * @todo Manage duration
   */
  static fadeIn(element, display, duration = 500) {
    element.style.opacity = 0;
    element.style.display = display || 'block';
    (function fade(){
      let value = parseFloat(element.style.opacity);
      if (!((value += .1) > 1)) {
        element.style.opacity = value;
        requestAnimationFrame(fade);
      }
    })();
  };

  /**
   * Apply a fadeOut animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * @param {Number} duration - The duration of the animation in milliseconds.
   * 
   * @returns {Void}
   * 
   * @todo Manage duration
   */
  static fadeOut(element, duration = 500) {
    element.style.opacity = 1;
    (function fade() {
      if ((element.style.opacity -= .1) < 0) {
        element.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  };

  /**
   * Apply a slideUp animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * @param {Number} duration - The duration of the animation in milliseconds.
   * 
   * @returns {Void}
   */
  static slideUp(element, duration = 500) {
    element.style.transitionProperty = 'height, margin, padding';
    element.style.transitionDuration = duration + 'ms';
    element.style.boxSizing = 'border-box';
    element.style.height = element.offsetHeight + 'px';
    element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    window.setTimeout( () => {
      element.style.display = 'none';
      element.style.removeProperty('height');
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition-duration');
      element.style.removeProperty('transition-property');
    }, duration);
  };

  /**
   * Apply a slideDown animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * @param {Number} duration - The duration of the animation in milliseconds.
   * 
   * @returns {Void}
   */
  static slideDown(element, duration = 500) {
    element.style.removeProperty('display');
    console.log(element)
    let display = window.getComputedStyle(element).display;
    if (display === 'none') display = 'block';
    element.style.display = display;
    let height = element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    element.offsetHeight;
    element.style.boxSizing = 'border-box';
    element.style.transitionProperty = "height, margin, padding";
    element.style.transitionDuration = duration + 'ms';
    element.style.height = height + 'px';
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    window.setTimeout( () => {
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition-duration');
      element.style.removeProperty('transition-property');
    },duration);
  };

  /**
   * Apply the opposite animation effect to a given element.
   * 
   * @param {HTMLElement} element - The element to animate.
   * @param {string} [type=animation.fadeIn] - The animation to apply. By default, it's 'fadeIn'.
   * @param {number} [duration=500] - The duration of the animation in milliseconds. By default, it's 500.
   * 
   * @return {Object} Returns the result of the Animation function with the opposite animation, the element, and the duration as parameters.
   */
  static animateBack(element, type = animation.fadeIn , duration = 500) {
    const animations = {
      fadeIn: 'fadeOut',
      slideDown: 'slideUp'
    };
    return Animation[animations[type]](element, duration);
  }
};