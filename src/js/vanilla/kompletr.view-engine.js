/**
 * @description Test
 */
export class ViewEngine {

  _dom = null;

  _eventManager = null;

  constructor(dom, eventManager) {
    this._dom = dom;
    this._eventManager = eventManager;
  }

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
        this._dom.focused = this._dom.result.children[pointer];
        this._dom.result.children[pointer].className += ' focus';
        break;
      case 'remove':
        this._dom.focused = null;
        Array.from(this._dom.result.children).forEach(result => {
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
   * @emits CustomEvent 'kompletr.view.result.done'
   * 
   * @returns {Void}
   */
  showResults(data, options, done) {
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
              let properties = Array.isArray(options.fieldsToDisplay) && options.fieldsToDisplay.length ? options.fieldsToDisplay: Object.keys(current.data);
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

    this._dom.result.innerHTML = html;

    done(); // TODO do better 
  }
}