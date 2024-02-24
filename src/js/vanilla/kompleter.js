((window) => {
  if (window.kompleter) {
    throw new Error('window.kompleter already exists !');
  }

  const kompleter = {
    animations: {
      fadeIn: function(element, display) {
        element.style.opacity = 0;
        element.style.display = display || 'block';
        (function fade(){
          let value = parseFloat(element.style.opacity);
          if (!((value += .1) > 1)) {
            element.style.opacity = value;
            requestAnimationFrame(fade);
          }
        })()
      },
      fadeOut: function(element) {
        element.style.opacity = 1;
        (function fade() {
          if ((element.style.opacity -= .1) < 0) {
            element.style.display = 'none';
          } else {
            requestAnimationFrame(fade);
          }
        })();
      },
      slideUp: function() {

      },
      slideDown: function() {

      }
    },
    events: {
      'kompleter.render.result.done': new CustomEvent('kompleter.render.result.done', {
        detail: {},
        bubble: true,
        cancelable: false,
        composed: false,
      }),
      'kompleter.request.done': new CustomEvent('kompleter.request.done', {
        detail: {},
        bubble: true,
        cancelable: false,
        composed: false,
      }),
      'kompleter.result.show': new CustomEvent('kompleter.result.show', {
        detail: {},
        bubble: true,
        cancelable: false,
        composed: false,
      })
    },
    handlers: {
      build: function (element, attributes = []) {
        const htmlElement = document.createElement(element);
        attributes.forEach(attribute => {
          htmlElement.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
        });
        return htmlElement;
      },
      filter: function(records) {
        const value = kompleter.htmlElements.input.value.toLowerCase();
        return records.filter(record => {
          if(isNaN(value)) {
            return kompleter.options.begin === true ? record[kompleter.options.filterOn].toLowerCase().lastIndexOf(value, 0) === 0 : record[kompleter.options.filterOn].toLowerCase().lastIndexOf(value) !== -1;
          } else {
            return parseInt(value) === parseInt(record[kompleter.options.filterOn]);
          }
        });
      },
      focus: function(action) {
        if (!['add', 'remove'].includes(action)) {
          throw new Error('action should be one of ["add", "remove]: ' + action + ' given.');
        }
        switch (action) {
          case 'remove':
            kompleter.htmlElements.focused = null;
            Array.from(kompleter.htmlElements.suggestions).forEach(suggestion => {
              ((suggestion) => {
                suggestion.className = 'item--result';
              })(suggestion)
            });
            break;
          case 'add':
            kompleter.htmlElements.focused = kompleter.htmlElements.suggestions[kompleter.props.pointer];
            kompleter.htmlElements.suggestions[kompleter.props.pointer].className += ' focus';
            break;
        }
      },
      navigate: function (keyCode) {
        // TODO fix navigation after last element is broken
        this.point(keyCode);
        this.focus('remove');
        this.focus('add');
      },
      point: function(keyCode) {
        // The pointer is in the range: after or as the initial position and before the last element in suggestions
        if(kompleter.props.pointer >= -1 && kompleter.props.pointer <= kompleter.htmlElements.suggestions.length - 1) {
          // Pointer in initial position, and we switch down -> up index of the pointer
          if(kompleter.props.pointer === -1 && keyCode === 40) {
            kompleter.props.pointer++;
          } else if (kompleter.props.pointer === kompleter.htmlElements.suggestions.length - 1 && keyCode === 38) {  // Pointer in last position, and we switch up -> down index of the pointer
            kompleter.props.pointer--;
          } else if (keyCode === 38) { // Pointer in range, down index of the pointer
            kompleter.props.pointer--;
          } else if (keyCode === 40) { // Pointer in range, up index of the pointer
            kompleter.props.pointer++;
          }
        }
      },
      request: function() {
        const headers = new Headers();
        headers.append('content-type', 'application/x-www-form-urlencoded');
        headers.append('method', 'GET');

        fetch(`${kompleter.options.dataSource}?'r=${kompleter.htmlElements.input.value}`, headers)
          .then(result => result.json())
          .then(result => {
            kompleter.props.response = this.filter(result);
            document.dispatchEvent(kompleter.events['kompleter.request.done']);
          })
          .catch(e => {
            console.error(e.message);
            kompleter.htmlElements.result.innerHTML = '<div class="item--result">Error</div>';
            kompleter.animations.fadeIn(kompleter.htmlElements.result);
          });
      },
      select: function () {
        let id = null;
        id = kompleter.htmlElements.focused.id || 0;
        kompleter.htmlElements.input.value = kompleter.props.response[id][0];
        kompleter.props.pointer = -1;
        kompleter.htmlElements.result.style.display = 'none';
      },
      validate: function(options) {
        // Ne valider que ce qui est donné ou requis
        // Le reste doit fallback sur des valeurs par défaut quand c'est possible
      }
    },
    htmlElements: {
      focused: null,
      input: null,
      result: null,
      suggestions: [],
    },
    listeners: {
      onHide: () => {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', (e) => {
          kompleter.animations.fadeOut(kompleter.htmlElements.result);
        });
      },
      onSelect: (className) => {
        kompleter.htmlElements.suggestions = document.getElementsByClassName(className);
        if(typeof kompleter.htmlElements.suggestions !== 'undefined') {
          const numberOfSuggestions = kompleter.htmlElements.suggestions.length;
          if(numberOfSuggestions) {
            for(let i = 0; i < numberOfSuggestions; i++) {
              ((i) => {
                return kompleter.htmlElements.suggestions[i].addEventListener('click', (e) => {
                  kompleter.htmlElements.focused = kompleter.htmlElements.suggestions[i];
                  kompleter.handlers.select();
                });
              })(i)
            }
          }
        }
      },
      onRequestDone: () => {
        document.addEventListener('kompleter.request.done', (e) => {
          kompleter.renders.results(e)
        });
      },
      onRenderDone: () => {
        document.addEventListener('kompleter.render.result.done', (e) => {
          console.log('kompleter.render.result.done', e)
          kompleter.animations.fadeIn(kompleter.htmlElements.result);
          kompleter.listeners.onSelect('item--result');
        });
      },
      onShow: () => {
        document.addEventListener('kompleter.result.show', (e) => {
          kompleter.animations.fadeIn(kompleter.htmlElements.result);
          kompleter.listeners.onSelect('item--result');
        });
      },
      onType: () => {
        kompleter.htmlElements.input.addEventListener('keyup', (e) => {
          const keyCode = e.keyCode;
          if(keyCode === 38 || keyCode === 40) { // Up / down 
            kompleter.handlers.navigate(keyCode);
          } else if (keyCode === 13) { // Enter 
            kompleter.handlers.select();
          } else if (kompleter.htmlElements.input.value !== kompleter.props.previousValue) {
            kompleter.handlers.request();
          }
        });
      },
    },
    options: {
      id: null,
      dataSource: null,
      store: {
        type: 'memory', // memory | indexedDB | localStorage
        timelife: 50000,
      },
      animation: {
        type: 'fadeIn',
        duration: 500
      },
      begin: true,
      startOnChar: 2,
      maxResults: 10,
      filterOn: null,
      fieldsToDisplay: null,
      beforeDisplayResults: (e, dataset) => {},
      afterDisplayResults: (e, dataset) => {},
      beforeFocusOnItem: (e, dataset, current) => {},
      afterFocusOnItem: (e, dataset, current) => {},
      beforeSelectItem: (e, dataset, current) => {},
      afterSelectItem: (e, dataset, current) => {},
    },
    props: {
      response: {}, // Clarify / refactor the usage of response vs suggestions
      pointer: -1,
      previousValue: null,
    },
    renders: {
      results: function(e) {
        console.log('render.results', e)
        let html = '';
        if(kompleter.props.response && kompleter.props.response.length) {
          const properties = kompleter.options.fieldsToDisplay.length; // TODO should be validated as 3 or 4 max + flexbox design
          for(let i = 0; i < kompleter.props.response.length ; i++) {
            if(typeof kompleter.props.response[i] !== 'undefined') {
              html += `<div id="${i}" class="item--result ${i + 1 === kompleter.props.response.length ? 'last' : ''}">`;
              for(let j = 0; j < properties; j++) {
                html += '<span class="data-' + j + '">' + kompleter.props.response[i][j] + '</span>';
              }
              html += '</div>';
            } 
          } 
        } else {
          html = '<div class="item--result">Not found</div>';
        }
        kompleter.htmlElements.result.innerHTML = html;
        console.log('kompleter.htmlElements.result', kompleter.htmlElements.result)
        document.dispatchEvent(kompleter.events['kompleter.render.result.done'])
      }
    },
    init: function(options) {

      // Préfixer sur les valeurs

      // ---------- Gérer les callbacks opts

      // ---------- Gérer le store
        // Gérer le fetch mutliple en cas de store
        // Gérer la durée de validité du store en cas de store

      // ---------- Gérer les animations

      kompleter.options = Object.assign(kompleter.options, options);
      
      kompleter.htmlElements.result = kompleter.handlers.build('div', [ { id: 'result' }, { className: 'form--lightsearch__result' } ]);
      
      const searcher = document.getElementById('wrapper');
      searcher.appendChild(kompleter.htmlElements.result);

      kompleter.htmlElements.input = document.getElementById(kompleter.options.id);

      // ---------- Gérer les paramètres opts

        // Aller chercher sur data- et options, faire un merge, c'est options qui gagne si conflit
        // Valider le résultat
          // id unique, obligé

        // L'assigner si c'est ok

        // /!\ Si tu bouges aux options ici, tu vas devoir adapter le jQuery aussi

      // --- Currently managed as data-attributes

      const dataSource = kompleter.htmlElements.input.dataset['url'];
      const filterOn = kompleter.htmlElements.input.dataset['filter-on'];
      const fieldsToDisplay = kompleter.htmlElements.input.dataset['fields-to-display'];

      console.log('v', dataSource)
      console.log('v', filterOn)
      console.log('v', fieldsToDisplay)

      // --- Other ones
      
      /**
      id
      store: false, // Todo
      animation: '', // Todo
      animationSpeed: '', // Todo
      begin: true,
      startOnChar: 2,
      maxResults: 10,
      beforeDisplayResults: (e, dataset) => {},
      afterDisplayResults: (e, dataset) => {},
      beforeFocusOnItem: (e, dataset, current) => {},
      afterFocusOnItem: (e, dataset, current) => {},
      beforeSelectItem: (e, dataset, current) => {},
      afterSelectItem: (e, dataset, current) => {},
      */

      // --- Playable as data-

      /**
      store: false, // Todo
      animation: '', // Todo
      animationSpeed: '', // Todo
      begin: true,
      startOnChar: 2,
      maxResults: 10,
      */
      
      // --- Required as options

      /**
      beforeDisplayResults: (e, dataset) => {},
      afterDisplayResults: (e, dataset) => {},
      beforeFocusOnItem: (e, dataset, current) => {},
      afterFocusOnItem: (e, dataset, current) => {},
      beforeSelectItem: (e, dataset, current) => {},
      afterSelectItem: (e, dataset, current) => {},
      */

      // --- Special case: the id -> ? Pass the input by id reference or HTMLElement ?

      kompleter.listeners.onHide();
      kompleter.listeners.onShow();
      kompleter.listeners.onType();
      kompleter.listeners.onRequestDone();
      kompleter.listeners.onRenderDone();
    },
  };

  window.kompleter = { init: kompleter.init };
})(window);