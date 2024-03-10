import { build } from './kompletr.utils';

/**
 * @description
 */
export class DOM {

  /**
   * @description Main input text
   */
  _input = null;

  /**
   * @description HTMLElement in suggestions who's have the focus
   */
  _focused = null;

  /**
   * @description HTMLElement results container
   */
  _result = null;

  constructor(input, options = { theme: 'light' }) {
    this._input = input instanceof HTMLInputElement ? input : document.getElementById(input);

    this._result = build('div', [ { id: 'kpl-result' }, { class: 'form--search__result' } ]);

    this._input.parentElement.setAttribute('class', `${this._input.parentElement.getAttribute('class')} kompletr ${options.theme}`);
    this._input.parentElement.appendChild(this._result);
  }

  get input() {
    return this._input;
  }

  set input(value) {
    this._input = value;
  }

  get focused() {
    return this._focused;
  }

  set focused(value) {
    this._focused = value;
  }

  get result() {
    return this._result;
  }

  set result(value) {
    this._result = value;
  }
}