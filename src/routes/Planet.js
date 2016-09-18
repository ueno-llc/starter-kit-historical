import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import connect from 'utils/connect';

/**
 * Planet route component
 */
@connect
export default class Planet extends Component {

  static propTypes = {
    params: PropTypes.object,
  };

  componentWillMount() {
    const { planets } = this.context.store;
    const { id } = this.props.params;

    planets.fetchPlanet(id);
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const { planets } = this.context.store;
    const { id } = this.props.params;

    const planet = planets.getPlanet(id);

    return (
      <div>
        <Helmet title="Planet" />
        <Segment>
          {planet.isLoading ? (
            <div>{planet.hasError ? 'Error fetching planet' : 'Loading planet'}</div>
          ) : (
            <div>
              <h1>{planet.data.name}</h1>
              <p>Gravity: {planet.data.gravity}</p>
              <Link to="/">Go back</Link>
            </div>
          )}
        </Segment>
      </div>
    );
  }
}
