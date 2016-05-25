/* eslint global-require: 0 */
import React, { Component, PropTypes } from 'react';
import ClockWC from './ClockWC';

/**
 * Clock component
 */
export default class Clock extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  componentDidMount() {
    document.registerElement('react-clock', ClockWC);
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    return (
      <react-clock />
    );
  }
}
