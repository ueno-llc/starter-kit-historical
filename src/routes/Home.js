import React, { Component } from 'react';
import Clock from 'clock/Clock';
/**
 * Home route component
 */
export default class Home extends Component {

  /**
   * Render method
   * @return {Component}
   */
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Clock />
      </div>
    );
  }
}
