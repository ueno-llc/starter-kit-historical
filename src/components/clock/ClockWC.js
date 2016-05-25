import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Clock component tells time.
 *
 * @extends HTMLElement
 */
export default class ClockComponent extends HTMLElement {

  /**
   * Fired on interval
   * @return {void}
   */
  update() {
    ReactDOM.render(<span>{(new Date()).toTimeString().substr(0, 8)}</span>, this.mount); // eslint-disable-line
  }

  /**
   * Fired when Web Component is initialized
   * @return {void}
   */
  createdCallback() {
    this.mount = document.createElement('span');
    this.createShadowRoot().appendChild(this.mount);

    // Update clock
    setInterval(this.update.bind(this), 1000);
  }
}
