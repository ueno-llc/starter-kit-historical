import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Segment from 'components/segment';

/**
 * Home route component
 */
export default class NotFound extends Component {

  /**
   * Render method
   * @return {Component}
   */
  render() {
    return (
      <div>
        <Helmet title="404 Not Found" />
        <Segment>
          <h1>Page was not found</h1>
        </Segment>
      </div>
    );
  }
}
