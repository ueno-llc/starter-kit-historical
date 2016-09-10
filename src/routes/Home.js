import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import connect from 'utils/connect';

/**
 * Home route component
 */
@connect
export default class Home extends Component {

  componentDidMount() {
    const { store } = this.context;
    store.fetchPlanets();
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const { planets } = this.context.store;
    return (
      <div>
        <Helmet title="Home" />

        <Segment>
          {planets.isLoading ? (
            <div>Loading planets...</div>
          ) : (
            <ul>
              {planets.data.map((planet, i) => (
                <li key={`planet_${i}`}>{planet.name}</li>
              ))}
            </ul>
          )}
        </Segment>
      </div>
    );
  }
}
