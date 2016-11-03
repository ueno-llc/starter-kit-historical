import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import connect from 'utils/connect';

@connect('planets')
export default class Planets extends Component {

  static propTypes = {
    planets: PropTypes.object,
  };

  componentWillMount() {
    const { planets } = this.props;
    planets.fetchPlanets();
  }

  render() {
    const { planets } = this.props;

    return (
      <div>
        <Helmet title="Planets" />

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
