import React, { Component } from 'react';
import Segment from 'components/Segment';

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
          <h1>Elements</h1>
        </Segment>
      </div>
    );
  }
}
