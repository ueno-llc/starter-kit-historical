import React, { Component } from 'react';
import Helmet from 'react-helmet';
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
        <Helmet title="Home" />
        <Segment>
          <h1>Nothing feel's like ::ffff!</h1>
        </Segment>
      </div>
    );
  }
}
