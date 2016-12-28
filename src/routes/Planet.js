import React, { Component, PropTypes } from 'react';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import connect from 'utils/connect';
import autobind from 'core-decorators/lib/autobind';

@connect('planets')
export default class Planet extends Component {

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    planets: MobxPropTypes.observableObject,
  };

  /**
   * Fired when component will mount.
   * @return {void}
   */
  componentWillMount() {
    const { planets, params } = this.props;

    // Fetch initial data needed
    this.planets = planets.fetchAll();
    this.planet = planets.fetchById(params.id);
  }

  /**
   * Render related section of the page
   *
   * @param {object} Data needed to render the section
   * @return {React.Component}
   */
  @autobind
  renderRelated({ results }) {

    // Calculate difference of two diameters
    const diff = (a, b) => Math.abs(b.diameter - a.diameter);
    const planet = this.planet.value;

    // Remove current planet, sort similar sizes, limit to 3.
    const items = results
      .filter(p => p.url !== planet.url)
      .sort((a, b) => diff(a, planet) - diff(b, planet))
      .slice(0, 3);

    return (
      <div>
        <h3>Planets with similar diameter</h3>
        <ul>
          {items.map((related, i) => (
            <li key={`related_${i}`}>{related.name} ({related.diameter})</li>
          ))}
        </ul>
      </div>
    );
  }

  /**
   * Render method
   * @return {React.Component}
   */
  render() {
    return (
      <div>
        <Helmet title="Planet loading..." />
        <Segment>
          {this.planet.case({

            // This will be rendered when the data is being fetched.
            // Or in other words, when this promise hasn't been resolved or rejected yet.
            pending: () => (<div>Loading planet...</div>),

            // This will be rendered when the promise will reject for some expected
            // or unexpected reasons.
            rejected: (error) => (<div>Error fetching planet: {error.message}</div>),

            // This is when all the result of the promise is ready to be used.
            // Try to have everything ready at this moment to have the render
            // method as clean as possible.
            fulfilled: ({ name, gravity, terrain, climate, population, diameter }) => (
              <div>
                <Helmet title={`Planet ${name}`} />
                <h1>{name}</h1>
                <ul>
                  <li><strong>Gravity:</strong> {gravity}</li>
                  <li><strong>Terrain:</strong> {terrain}</li>
                  <li><strong>Climate:</strong> {climate}</li>
                  <li><strong>Population:</strong> {population}</li>
                  <li><strong>Diameter:</strong> {diameter}</li>
                </ul>
                <Link to="/planets">Go back</Link>
                <hr />

                {/* Now we can render the related planets */}
                {this.planets.case({
                  pending: () => (<div>Loading related planets...</div>),
                  rejected: (error) => (<div>Could fetch related planets: {error.message}</div>),
                  fulfilled: this.renderRelated,
                })}
              </div>
            ),
          })}
        </Segment>
      </div>
    );
  }
}
