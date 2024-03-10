/**
 * @descrption Animations functions.
 */

/**
 * @description Apply a fadeIn animation effect
 * 
 * @param {HTMLElement} element Target HTML element
 * @param {String} display CSS3 display property value
 * @param {Number} duration Duration of the animation in ms
 * 
 * @returns {Void}
 * 
 * @todo Manage duration
 */
const fadeIn = (element, display = 'block', duration = 500) => {
  element.style.opacity = 0;
  element.style.display = display;
  (function fade(){
    let value = parseFloat(element.style.opacity);
    if (!((value += .1) > 1)) {
      element.style.opacity = value;
      requestAnimationFrame(fade);
    }
  })()
};

/**
 * @description Apply a fadeOut animation effect
 * 
 * @param {HTMLElement} element Target HTML element
 * @param {Number} duration Duration of the animation in ms. Default 500ms
 * 
 * @returns {Void}
 * 
 * @todo Manage duration
 */
const fadeOut = (element, duration = 500) => {
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
 * @description Apply a slideUp animation effect
 * 
 * @param {HTMLElement} element Target HTML element
 * @param {Number} duration Duration of the animation in ms. Default 500ms
 * 
 * @returns {Void}
 */
const slideUp = (element, duration = 500) => {
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
 * @description Apply a slideDown animation effect
 * 
 * @param {HTMLElement} element Target HTML element
 * @param {Number} duration Duration of the animation in ms. Default 500ms
 * 
 * @returns {Void}
 */
const slideDown = (element, duration = 500) => {
  element.style.removeProperty('display');
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
  }, duration);
};

export { fadeIn, fadeOut, slideUp, slideDown };