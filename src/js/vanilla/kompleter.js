((window) => {
  if (window.kompleter) {
    throw new Error('window.kompleter already exists !');
  }

  window.kompleter = {
    HTMLElements: {
      focused: null,
      input: null,
      result: null,
      suggestions: [],
    },
    props: {
      response: {},
      pointer: -1,
      previousValue: null,
    },
    options: {
      id: '',
      url: '',
      store: false,
      animation: '',
      animationSpeed: '',
      begin: true,
      startOnChar: 2,
      maxResults: 10,
      field: null,
      fieldsToDisplay: null,
      beforeDisplay: (e, dataset) => {},
      afterDisplay: (e, dataset) => {},
      beforeFocus: (e, dataset) => {},
      afterFocus: (e, dataset) => {},
      beforeComplete: (e, dataset) => {},
      afterComplete: (e, dataset) => {},
    },
    listeners: {
      onNavigate: () => {
        this.HTMLElements.input.addEventListener('keyup', (e) => {
          e = e || windows.event;
          const keycode = e.keycode;
          // Up / down in results
          if(keycode === 38 || keycode === 40) {
            kompleter.handlers.navigate(keycode);
          }
          // Insert suggestion who's have the focus
          else if (keycode === 13) {
            kompleter.handlers.select();
          } else {
            if(kompleter.HTMLElements.input.value !== kompleter.props.previousValue) {
              kompleter.handlers.display();
            }
          }
        });
      },
      onHide: (HTMLElements) => {
        const body = document.getElementsByTagName('body').shift();
        body.addEventListener('click', (e) => {
          HTMLElements.style.display = 'none';
        });
      },
      onSelect: (className) => {
        kompleter.HTMLElements.suggestions = document.getElementsByClassName(className);
        if(typeof kompleter.HTMLElements.suggestions !== 'undefined') {
          const numberOfSuggestions = kompleter.HTMLElements.suggestions.length;
          if(numberOfSuggestions) {
            for(let i = 0; i < numberOfSuggestions; i++) {
              return function(i) {
                kompleter.HTMLElements.suggestions[i].addEventListener('click', (e) => {
                  kompleter.HTMLElements.focused = kompleter.HTMLElements.suggestions[i];
                  kompleter.handlers.select();
                });
              }
            }
          }
        }
      }
    },
    handlers: {
      navigate: (keycode) => {
        if(kompleter.props.pointer >= -1 && kompleter.props.pointer <= kompleter.HTMLElements.suggestions.length - 1) {
          // Pointeur en dehors du data set, avant le premier résultat
          if(kompleter.props.pointer === -1) {
            if(keycode === 40) {
              kompleter.SetFocus(keycode);
            }
          }
          // Pointeur au dernier résultat du data set
          else if (kompleter.props.pointer === kompleter.HTMLElements.suggestions.length - 1) {
            if(keycode === 38) {
              kompleter.SetFocus(keycode);
            }
          }
          // Pointeur dans le data set
          else { 
            kompleter.SetFocus(keycode);
          }
        }
      },
      suggest: () => {
        kompleter.HTMLElements.result.style.display = 'block';
        kompleter.props.pointer = -1;
        
        const headers = new Headers();
        headers.append('content-type', 'application/x-www-form-urlencoded');
        headers.append('method', 'GET');

        fetch(`${kompleter.options.url}?'requestExpression=${kompleter.HTMLElements.input.value}`, headers)
          .then(result => result.json())
          .then(result => {
            let text = "";
            if(result && result.length) {
              kompleter.props.response = result;
              const properties = kompleter.options.fieldsToDisplay.length;
              for(let i = 0; i < result.length ; i++) {
                if(typeof response[i] !== 'undefined') {
                  let cls;
                  i + 1 === result.length ? cls = 'last' : cls = '';
                  text += '<div id="' + i + '" class="item--result">';
                  for(let j = 0; j < properties; j++) {
                    text += '<span class="data-' + j + '">' + response[i][j] + '</span>';
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
      select: () => {
        const id = null;
        kompleter.HTMLElements.focused !== null ? id = kompleter.HTMLElements.Focused.id : id = 0;
        kompleter.HTMLElements.input.value = kompleter.HTMLElements.response[id][0];
        kompleter.props.pointer = -1;
        kompleter.HTMLElements.result.style.display = 'none';
      },
    },
    init: (options) => {
      this.options = options;
      this.HTMLElements.result = this.build('div', [ { id: 'result', className: 'form--lightsearch__result' } ]);
      
      const searcher = document.getElementById('searcher');
      searcher.appendChild(this.HTMLElements.result);

      this.HTMLElements.input = document.getElementById('autocomplete');

      this.listeners.onNavigate();
      this.listeners.onHide();
    },
    build: (element, attributes = []) => {
      const html = document.createElement(element);
      attributes.forEach(attribute => {
        html.setAttribute(attribute.key, attribute.value);
      });
    },
    setFocus: (keycode) => {
      if(keycode === 40) {
        if(this.Pointer !== -1) {
          kompleter.removeFocus();
        } 
        kompleter.props.pointer++;
        kompleter.getFocus();
      } else if(keycode === 38) {
        kompleter.removeFocus();
        kompleter.props.pointer--;
        if(kompleter.props.pointer !== -1) {
          kompleter.GetFocus();
        }
      }
    },
    getFocus: () => {
      kompleter.HTMLElements.focused = kompleter.HTMLElements.suggestions[kompleter.props.pointer];
      kompleter.HTMLElements.suggestions[kompleter.props.pointer].className += ' focus';
    },
    removeFocus: () => {
      kompleter.HTMLElements.focused = null;
      kompleter.HTMLElements.suggestions[kompleter.props.pointer].className += ' item--result';
    },
  };

  window.kompleter.init();
})(window);

// Le set properties, il n'est pas nécessaire -> tu peux define ça dans une config js coté client