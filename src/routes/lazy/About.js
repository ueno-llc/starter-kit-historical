import React, { Component } from 'react';
import Helmet from 'react-helmet';
/**
 * About route component
 */
export default class About extends Component {

  /**
   * Render method
   * @return {Component}
   */
  render() {
    return (
      <div>
        <Helmet title="About" />
        <h1>About</h1>
      </div>
    );
  }
}
