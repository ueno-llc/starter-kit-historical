import React, { Component } from 'react';
import Segment from 'components/segment';
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
        <Segment>
          <h1>About</h1>
        </Segment>
      </div>
    );
  }
}
