import { event } from './enums.js';

export class DOM {
  /**
   * @description Identifiers for the DOM elements
   */
  _identifiers = {
    results: 'kpl-result',
  };

  /**
   * @description Classes for the DOM elements
   */
  _classes = {
    main: 'kompletr',
    input: 'input--search',
    results: 'form--search__result',
    result: 'item--result',
    data: 'item--data',
    focus: 'focus',
  };

  /**
   * @description Body tag
   */
  _body = null;

  get body() {
    return this._body;
  }

  set body(value) {
    this._body = value;
  }

  /**
   * @description Main input text
   */
  _input = null;

  get input() {
    return this._input;
  }

  set input(value) {
    if (value instanceof HTMLInputElement === false) {
      throw new Error(`input should be an HTMLInputElement instance: ${value} given.`);
    }
    this._input = value;
  }

  /**
   * @description HTMLElement in suggestions who's have the focus
   */
  _focused = null;

  get focused() {
    return this._focused;
  }

  set focused(value) {
    this._focused = value;
  }

  /**
   * @description HTMLElement results container
   */
  _result = null;

  get result() {
    return this._result;
  }

  set result(value) {
    this._result = value;
  }
  
  /**
   * @description Broadcaster instance
   */
  _broadcaster = null;

  /**
   * Represents a Kompletr DOM container.
   * 
   * @param {string|HTMLInputElement} input - The input element or its ID.
   * @param {object} broadcaster - The broadcaster object.
   * @param {object} [options] - The options for the DOM object.
   * @param {string} [options.theme='light'] - The theme for the DOM object.
   * 
   * @returns {void}
   */
  constructor(input, broadcaster, options = { theme: 'light' }) {
    this._broadcaster = broadcaster;

    this.body = document.getElementsByTagName('body')[0];
    
    this.input = input instanceof HTMLInputElement ? input : document.getElementById(input);
    this.input.setAttribute('class', `${this._input.getAttribute('class')} ${this._classes.input}`);
    
    this.result = this.build('div', [ { id: this._identifiers.results }, { class: this._classes.results } ]);

    this.input.parentElement.setAttribute('class', `${this._input.parentElement.getAttribute('class')} ${this._classes.main} ${options.theme}`);
    this.input.parentElement.appendChild(this._result);
  }

  /**
  * @description Build an HTML element and set his attributes
  * 
  * @param {String} element HTML tag to build
  * @param {Object[]} attributes Key / values pairs
  * 
  * @returns {HTMLElement}
  */
  build(element, attributes = []) {
    const htmlElement = document.createElement(element);
    attributes.forEach(attribute => {
      htmlElement.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
    });
    return htmlElement;
   };

  /**
   * @description Add / remove the focus on a HTMLElement
   * 
   * @param {String} action add|remove
   *
   * @returns {Void}
   */
  focus(pointer) {
    if (isNaN(parseInt(pointer, 10)) || pointer < 0 || pointer > this.result.children.length - 1) {
      throw new Error('pointer should be a valid integer in the result lenght range: ' + pointer + ' given.');
    }

    this.focused = null;
    Array.from(this.result.children).forEach(result => {
      ((result) => {
        result.className = this._classes.result;
      })(result)
    });

    this.focused = this.result.children[pointer];
    this.result.children[pointer].className += ` ${this._classes.focus}`;
  }

  /**
   * @description Display results according to the current input value / setup
   * 
   * @returns {Void}
   */
  buildResults(data, fieldsToDisplay) {
    let html = '';

    if(data && data.length) {
      html = data
        .reduce((html, current) => {
          html += `<div id="${current.idx}" class="${this._classes.result}">`;
          switch (typeof current.data) {
            case 'string':
              html += `<span class="${this._classes.data}">${current.data}</span>`;
              break;
            case 'object':
              let properties = Array.isArray(fieldsToDisplay) && fieldsToDisplay.length ? fieldsToDisplay: Object.keys(current.data);
              for(let j = 0; j < properties.length; j++) {
                html += `<span class="${this._classes.data}">${current.data[properties[j]]}</span>`;
              }
              break;
          }
          html += '</div>';
          return html;
        }, '');
      
    } else {
      html = `<div class="${this._classes.result}">Not found</div>`;
    }

    this.result.innerHTML = html;

    this._broadcaster.trigger(event.domDone, this.result); // TODO: to be validated
  }
}