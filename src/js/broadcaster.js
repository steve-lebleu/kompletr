import { event } from './enums.js';

/**
 * Represents a Broadcaster that allows subscribing to and triggering events.
 */
export class Broadcaster {
  subscribers = [];

  constructor() {}

  /**
   * Subscribes to an event.
   * 
   * @param {string} type - The type of event to subscribe to.
   * @param {Function} handler - The event handler function.
   * 
   * @throws {Error} If the event type is not valid.
   */
  subscribe(type, handler) {
    if (!Object.values(event).includes(type)) {
      throw new Error(`Event should be one of ${Object.keys(event)}: ${type} given.`);
    }
    this.subscribers.push({ type, handler });
  }

  /**
   * Listens for an event on a specified element.
   * 
   * @param {HTMLElement} element - The element to listen on.
   * @param {string} type - The type of event to listen for.
   * @param {Function} handler - The event handler function.
   */
  listen(element, type, handler) {
    element.addEventListener(type, handler);
  }

  /**
   * Triggers an event.
   * 
   * @param {string} type - The type of event to trigger.
   * @param {Object} detail - Additional details to pass to the event handler.
   * 
   * @throws {Error} If the event type is not valid.
   */
  trigger(type, detail = {}) {
    if (!Object.values(event).includes(type)) {
      throw new Error(`Event should be one of ${Object.keys(event)}: ${type} given.`);
    }
    
    this.subscribers
      .filter(subscriber => subscriber.type === type)
      .forEach(subscriber => subscriber.handler(detail));
  }
}