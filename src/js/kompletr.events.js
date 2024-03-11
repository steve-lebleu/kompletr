/**
 * @description
 */
export class EventManager {
  
  constructor() {}

  static event = Object.freeze({
    error: 'error',
    navigationDone: 'navigationDone',
    renderDone: 'renderDone',
    dataDone: 'dataDone',
    resultDone: 'resultDone',
    selectDone: 'selectDone'
  })
  
  /**
   * @description Get a CustomEvent instance for an event with name 'kompletr.error'
   * 
   * @param {*} detail 
   * 
   * @returns {CustomEvent}
   */
  static error = (detail = { message: '', stack: '', name: ''}) => new CustomEvent('kompletr.error', {
    detail,
    bubble: true,
    cancelable: false,
    composed: false,
  })

  /**
   * @description Get a CustomEvent instance for an event with name 'kompletr.navigation.done'
   * 
   * @param {*} detail 
   * 
   * @returns {CustomEvent}
   */
  static navigationDone = (detail = {}) => new CustomEvent('kompletr.navigation.done', {
    detail,
    bubble: true,
    cancelable: false,
    composed: false,
  })

  /**
   * @description Get a CustomEvent instance for an event with name 'kompletr.view.result.done'
   * 
   * @param {*} detail 
   * 
   * @returns {CustomEvent}
   */
  static renderDone = (detail = {}) => new CustomEvent('kompletr.render.done', {
    detail,
    bubble: true,
    cancelable: false,
    composed: false,
  })

  /**
   * @description Get a CustomEvent instance for an event with name 'kompletr.request.done'
   * 
   * @param {*} detail 
   * 
   * @returns {CustomEvent}
   */
  static dataDone = (detail = { from: '', data: null }) => new CustomEvent('kompletr.data.done', {
    detail,
    bubble: true,
    cancelable: false,
    composed: false,
  })

  /**
   * @description Get a CustomEvent instance for an event with name 'kompletr.select.done'
   * 
   * @param {Object} detail 
   * 
   * @returns {CustomEvent}
   */
  static selectDone = (detail = {}) => new CustomEvent('kompletr.select.done', {
    detail,
    bubble: true,
    cancelable: false,
    composed: false,
  })

  static trigger(event, detail = {}) {
    if (!EventManager.event[event]) {
      throw new Error(`Unknown event ${event} triggered`);
    }
    document.dispatchEvent(EventManager[event](detail));
  }
}