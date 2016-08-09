import React, { Component } from 'react';
import Segment from 'components/segment';

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
        <Segment>
          <h1>Home</h1>
        </Segment>

        <Segment>
          <p>Some content</p>
        </Segment>
      </div>
    );
  }
}
