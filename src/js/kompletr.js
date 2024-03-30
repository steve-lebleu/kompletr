
import { Animation } from './animation.js';
import { event, origin, searchExpression } from './enums.js';

/**
 * @summary Kømpletr.js is a library providing features dedicated to autocomplete fields.
 * 
 * @author Steve Lebleu <ping@steve-lebleu.dev>
 * 
 * @see https://github.com/steve-lebleu/kompletr
 */
export default class Kompletr {
  /**
   * 
   */
  broadcaster = null;

  /**
   * 
   */
  cache = null;

  /**
   * 
   */
  callbacks = {};

  /**
   * 
   */
  configuration = null;

  /**
   * 
   */
  dom = null;

  /**
   * 
   */
  props = null;

  constructor({ configuration, properties, dom, cache, broadcaster, onKeyup, onSelect, onError }) {
    try {
      this.configuration = configuration;
      this.broadcaster = broadcaster;
      this.props = properties;
      this.dom = dom;
      this.cache = cache;

      this.broadcaster.subscribe(event.error, this.error);
      this.broadcaster.subscribe(event.dataDone, this.showResults);
      this.broadcaster.subscribe(event.domDone, Animation.fadeIn.bind(null, this.dom.result));
      this.broadcaster.subscribe(event.domDone, this.bindResults);
      this.broadcaster.subscribe(event.selectDone, this.closeTheShop);

      this.broadcaster.listen(this.dom.input, 'keyup', this.suggest);
      this.broadcaster.listen(this.dom.body, 'click', this.closeTheShop);

      if(onKeyup || onSelect || onError) {
        this.callbacks = Object.assign(this.callbacks, { onKeyup, onSelect, onError });
      }
    } catch(e) {
      broadcaster ? broadcaster.trigger(event.error, e) : console.error(`[kompletr] An error has occured -> ${e.stack}`);
    }
  }

  closeTheShop = (e) => {
    if (e.srcElement === this.dom.input) {
      return true;
    }
    Animation.fadeOut(this.dom.result);
    this.resetPointer();
  };

  resetPointer = () => {
    this.props.pointer = -1;
  };

  error = (e) => {
    console.error(`[kompletr] An error has occured -> ${e.stack}`);
    Animation.fadeOut(this.dom.result);
    this.callbacks.onError && this.callbacks.onError(e);
  };

  filter = (data, pattern) => {
    return data.filter((record) => {
      const value = typeof record.data === 'string' ? record.data : record.data[this.configuration.propToMapAsValue];
      if (this.configuration.filterOn === searchExpression.prefix) {
        return value.toLowerCase().lastIndexOf(pattern.toLowerCase(), 0) === 0;
      }
      return value.toLowerCase().lastIndexOf(pattern.toLowerCase()) !== -1;
    });
  };

  /**
   * @description CustomEvent 'this.request.done' listener
   * 
   * @todo Check something else to determine if we filter or not -> currently just the presence of onKeyup callback
   */
  showResults = async ({ from, data }) => {
    this.props.data = data;

    data = this.props.data.map((record, idx) => ({ idx, data: record }) ); // TODO: Check to avoid this

    // TODO: really when data comes from the cache ?
    if (!this.callbacks.onKeyup) {
      data = this.filter(data, this.dom.input.value);
    }

    if (this.cache && from !== origin.cache) {
      this.cache.set({ string: this.dom.input.value, data });
    }

    this.dom.buildResults(data.slice(0, this.configuration.maxResults), this.configuration.fieldsToDisplay);
  };

  /**
   * @description CustomEvent 'kompletr.dom.done' listener
   */
  bindResults = () => {    
    if(this.dom.result?.children?.length) {
      for(let i = 0; i < this.dom.result.children.length; i++) {
        ((i) => {
          return this.broadcaster.listen(this.dom.result.children[i], 'click', () => {
            this.dom.focused = this.dom.result.children[i];
            this.select(this.dom.focused.id);
          });
        })(i);
      }
    }
  };

  /**
   * @description 'input.keyup' listener
   */
  suggest = (e) => {
    if (this.dom.input.value.length < this.configuration.startQueryingFromChar) {
      return Animation.fadeOut(this.dom.result);
    }
    
    switch (e.keyCode) {
    case 13:  // Enter
      this.select(this.dom.focused.id);
      break;
    case 38: // Up
    case 40: // Down
      this.navigate(e.keyCode);
      break;
    default:
      if (this.dom.input.value !== this.props.previousValue) {
        this.hydrate(this.dom.input.value);
      }
      this.resetPointer();
      break;
    }
  };

  /**
   * @description Manage the data hydration according to the current setup (cache, request or local data)
   * 
   * @param {String} value Current input value
   * 
   * @emits CustomEvent 'this.request.done' { from, data }
   * @emits CustomEvent 'this.error' { error }
   * 
   * @returns {Void}
   * 
   * @todo options.data could returns Promise<Array>, and same for the onKeyup callback
   */
  hydrate = async (value) => {
    try {
      if (this.cache && await this.cache.isValid(value)) {
        this.cache.get(value, (data) => {
          this.broadcaster.trigger(event.dataDone, { from: origin.cache, data: data });  
        });
      } else if (this.callbacks.onKeyup) {
        this.callbacks.onKeyup(value, (data) => {
          this.broadcaster.trigger(event.dataDone, { from: origin.callback, data: data });
        });
      } else {
        this.broadcaster.trigger(event.dataDone, { from: origin.local, data: this.props.data });
      }
    } catch(e) {
      this.broadcaster.trigger(event.error, e);
    }
  };

  /**
   * @description Apply visual navigation into the suggestions set
   * 
   * @param {Number} keyCode The current keyCode value
   * 
   * @returns {Void}
   */
  navigate = (keyCode) => {
    try {
      if (keyCode != 38 && keyCode != 40) {
        return false;
      }
  
      if(this.props.pointer < -1 || this.props.pointer > this.dom.result.children.length - 1) {
        return false;
      }
      
      if ((keyCode === 38 && this.props.pointer === 0) || (keyCode === 40 && this.props.pointer === this.dom.result.children.length - 1)) {
        return false;
      }

      if (keyCode === 38 && this.props.pointer >= -1) {
        this.props.pointer--;
      } else if (keyCode === 40 && this.props.pointer < this.dom.result.children.length - 1) {
        this.props.pointer++;
      } 
  
      this.dom.focus(this.props.pointer);
    } catch(e) {
      this.broadcaster.trigger(event.error, e);
    }
  };

  /**
   * @description Select a suggested item as user choice
   * 
   * @param {Number} idx The index of the selected suggestion
   * 
   * @emits CustomEvent 'this.select.done'
   * 
   * @returns {Void}
   */
  select = (idx = 0) => {
    try {
      this.dom.input.value = typeof this.props.data[idx] === 'object' ? this.props.data[idx][this.configuration.propToMapAsValue] : this.props.data[idx];
      this.callbacks.onSelect && this.callbacks.onSelect(this.props.data[idx]);
      this.broadcaster.trigger(event.selectDone);
    } catch(e) {
      this.broadcaster.trigger(event.error, e);
    }
  };
}