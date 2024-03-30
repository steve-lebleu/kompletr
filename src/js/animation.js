/**
 * Represents an Animation class that provides various animation effects.
 */
export class Animation {
  constructor() {}

  /**
   * Apply a fadeIn animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * 
   * @returns {Void}
   * 
   * @todo Manage duration
   */
  static fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    (function fade(){
      let value = parseFloat(element.style.opacity);
      if (!((value += .1) > 1)) {
        element.style.opacity = value;
        requestAnimationFrame(fade);
      }
    })();
  }

  /**
   * Apply a fadeOut animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * 
   * @returns {Void}
   * 
   * @todo Manage duration
   */
  static fadeOut(element) {
    element.style.opacity = 1;
    (function fade() {
      if ((element.style.opacity -= .1) < 0) {
        element.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }
}