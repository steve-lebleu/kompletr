import { event } from './enums.js';

/**
 * @description
 */
export class DOM {

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
    if (input instanceof HTMLInputElement === false) {
      throw new Error(`input should be an HTMLInputElement instance: ${input} given.`);
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
  
  _broadcaster = null;

  // TODO: do better with hardcoded theme and classes
  // TODO: do bindings out of the constructor
  constructor(input, broadcaster, options = { theme: 'light' }) {
    this._body = document.getElementsByTagName('body')[0];
    
    this._input = input instanceof HTMLInputElement ? input : document.getElementById(input);
    this._input.setAttribute('class', `${this._input.getAttribute('class')} input--search`);
    
    this._result = this.build('div', [ { id: 'kpl-result' }, { class: 'form--search__result' } ]);

    this._input.parentElement.setAttribute('class', `${this._input.parentElement.getAttribute('class')} kompletr ${options.theme}`);
    this._input.parentElement.appendChild(this._result);


    this._broadcaster = broadcaster;
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
  focus(pointer, action) {
    if (!['add', 'remove'].includes(action)) {
      throw new Error('action should be one of ["add", "remove]: ' + action + ' given.');
    }

    switch (action) {
      case 'add':
        this.focused = this.result.children[pointer];
        this.result.children[pointer].className += ' focus';
        break;
      case 'remove':
        this.focused = null;
        Array.from(this.result.children).forEach(result => {
          ((result) => {
            result.className = 'item--result';
          })(result)
        });
        break;
    }
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
          html += `<div id="${current.idx}" class="item--result">`;
          switch (typeof current.data) {
            case 'string':
              html += `<span class="item--data">${current.data}</span>`;
              break;
            case 'object':
              let properties = Array.isArray(fieldsToDisplay) && fieldsToDisplay.length ? fieldsToDisplay: Object.keys(current.data);
              for(let j = 0; j < properties.length; j++) {
                html += `<span class="item--data">${current.data[properties[j]]}</span>`;
              }
              break;
          }
          html += '</div>';
          return html;
        }, '');
      
    } else {
      html = '<div class="item--result">Not found</div>';
    }

    this.result.innerHTML = html;
    this._broadcaster.trigger(event.domDone); // TODO here or in the handlers ?
  }
}