import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import connect from 'utils/connect';

/**
 * Home route component
 */
@connect
export default class Home extends Component {

  componentWillMount() {
    const { planets } = this.context.store;
    planets.fetchPlanets();
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
              <ul>
                {planets.data.map((planet, i) => (
                  <li key={`planet_${i}`}>
                    <Link to={`/planet/${planet.url.match(/(\d+)\/$/)[1]}`}>{planet.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Segment>
      </div>
    );
  }
}
