((window) => {
  if (window.kompleter) {
    throw new Error('window.kompleter already exists !');
  }

  const kompleter = {
    HTMLElements: {
      focused: null,
      input: null,
      result: null,
      suggestions: [],
    },
    props: {
      response: {}, // Clarify / refactor the usage of response vs suggestions
      pointer: -1,
      previousValue: null,
    },
    options: {
      id: 'default-kompleter', // Todo
      dataSource: '',
      store: false, // Todo
      animation: '', // Todo
      animationSpeed: '', // Todo
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
    listeners: {
      onType: () => {
        kompleter.HTMLElements.input.addEventListener('keyup', (e) => {
          const keyCode = e.keyCode;

          if(keyCode === 38 || keyCode === 40) { // Up / down 
            kompleter.handlers.navigate(keyCode);
          } else if (keyCode === 13) { // Enter 
            kompleter.handlers.select();
          } else if (kompleter.HTMLElements.input.value !== kompleter.props.previousValue) {
            kompleter.handlers.suggest();
          }
        });
      },
      onHide: () => {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', (e) => {
          kompleter.HTMLElements.result.style.display = 'none';
        });
      },
      onSelect: (className) => {
        kompleter.HTMLElements.suggestions = document.getElementsByClassName(className);
        if(typeof kompleter.HTMLElements.suggestions !== 'undefined') {
          const numberOfSuggestions = kompleter.HTMLElements.suggestions.length;
          if(numberOfSuggestions) {
            for(let i = 0; i < numberOfSuggestions; i++) {
              ((i) => {
                return kompleter.HTMLElements.suggestions[i].addEventListener('click', (e) => {
                  kompleter.HTMLElements.focused = kompleter.HTMLElements.suggestions[i];
                  kompleter.handlers.select();
                });
              })(i)
            }
          }
        }
      }
    },
    handlers: {
      build: function (element, attributes = []) {
        const htmlElement = document.createElement(element);
        attributes.forEach(attribute => {
          htmlElement.setAttribute(attribute.key, attribute.value);
        });
        return htmlElement;
      },
      filter: function(records) {
        const value = kompleter.HTMLElements.input.value.toLowerCase();
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
            kompleter.HTMLElements.focused = null;
            Array.from(kompleter.HTMLElements.suggestions).forEach(suggestion => {
              ((suggestion) => {
                suggestion.className = 'item--result';
              })(suggestion)
            });
            break;
          case 'add':
            kompleter.HTMLElements.focused = kompleter.HTMLElements.suggestions[kompleter.props.pointer];
            kompleter.HTMLElements.suggestions[kompleter.props.pointer].className += ' focus';
            break;
        }
      },
      navigate: function (keyCode) {
        this.point(keyCode);
        this.focus('remove');
        this.focus('add');
      },
      point: function(keyCode) {
        // The pointer is in the range: after or as the initial position and before the last element in suggestions
        if(kompleter.props.pointer >= -1 && kompleter.props.pointer <= kompleter.HTMLElements.suggestions.length - 1) {
          // Pointer in initial position, and we switch down -> up index of the pointer
          if(kompleter.props.pointer === -1 && keyCode === 40) {
            kompleter.props.pointer++;
          } else if (kompleter.props.pointer === kompleter.HTMLElements.suggestions.length - 1 && keyCode === 38) {  // Pointer in last position, and we switch up -> down index of the pointer
            kompleter.props.pointer--;
          } else if (keyCode === 38) { // Pointer in range, down index of the pointer
            kompleter.props.pointer--;
          } else if (keyCode === 40) { // Pointer in range, up index of the pointer
            kompleter.props.pointer++;
          }
        }
      },
      select: function () {
        let id = null;
        id = kompleter.HTMLElements.focused.id || 0;
        kompleter.HTMLElements.input.value = kompleter.props.response[id][0];
        kompleter.props.pointer = -1;
        kompleter.HTMLElements.result.style.display = 'none';
      },
      suggest: function () {
        kompleter.HTMLElements.result.style.display = 'block';
        kompleter.props.pointer = -1;
        
        // TODO requestExpression should be managed somewhere else. This method is just responsible to retrieve the data. To challenge vs the cache/store

        const headers = new Headers();
        headers.append('content-type', 'application/x-www-form-urlencoded');
        headers.append('method', 'GET');

        fetch(`${kompleter.options.dataSource}?'requestExpression=${kompleter.HTMLElements.input.value}`, headers)
          .then(result => result.json())
          .then(result => {
            console.log('result', result)
            console.log('result', typeof result)
            let text = "";
            if(result && result.length) {
              kompleter.props.response = this.filter(result);
              const properties = kompleter.options.fieldsToDisplay.length;
              for(let i = 0; i < result.length ; i++) {
                if(typeof kompleter.props.response[i] !== 'undefined') {
                  let cls;
                  i + 1 === result.length ? cls = 'last' : cls = '';
                  text += '<div id="' + i + '" class="item--result">';
                  for(let j = 0; j < properties; j++) {
                    text += '<span class="data-' + j + '">' + kompleter.props.response[i][j] + '</span>';
                  }
                  text += '</div>';
                } 
              } 
            } else {
              text = '<div class="item--result">Not found</div>';
            }
            
            // text = '<div class="item--result">Error</div>';
              
            kompleter.HTMLElements.result.innerHTML = text;
            kompleter.listeners.onSelect('item--result');
          });
      },
      validate: function(options) {
        // Ne valider que ce qui est donné ou requis
        // Le reste doit fallback sur des valeurs par défaut quand c'est possible
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
      
      kompleter.HTMLElements.result = kompleter.handlers.build('div', [ { id: 'result', className: 'form--lightsearch__result' } ]);
      
      const searcher = document.getElementById('wrapper');
      searcher.appendChild(kompleter.HTMLElements.result);

      kompleter.HTMLElements.input = document.getElementById('auto-complete');

      // ---------- Gérer les paramètres opts

        // Aller chercher sur data- et options, faire un merge, c'est options qui gagne si conflit
        // Valider le résultat
          // id unique, obligé

        // L'assigner si c'est ok

        // /!\ Si tu bouges aux options ici, tu vas devoir adapter le jQuery aussi

      // --- Currently managed as data-attributes

      const dataSource = kompleter.HTMLElements.input.dataset['url'];
      const filterOn = kompleter.HTMLElements.input.dataset['filter-on'];
      const fieldsToDisplay = kompleter.HTMLElements.input.dataset['fields-to-display'];

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
      
      kompleter.listeners.onType();
      kompleter.listeners.onHide();
    },
  };

  window.kompleter = { init: kompleter.init };
})(window);