import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import Other from 'components/other';
import connect from 'utils/connect';

/**
 * Home route component
 */
@connect
export default class Home extends Component {

  componentWillMount() {
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
          {planets.isLoading
          ? (<div>Loading planets...</div>)
          : (
            <div>
              {/* Will be rendered after planets have loaded */}
              <Other />
              <ul>
                {planets.data.map((planet, i) => (
                  <li key={`planet_${i}`}>{planet.name}</li>
                ))}
              </ul>
            </div>
          )}
        </Segment>
      </div>
    );
  }
}
