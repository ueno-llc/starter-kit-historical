// Store object
// Example implementation uses https://swapi.co/api/planets
// and expects the format { results: [] } for the list results
// and {} for fetching one item

import { extendObservable, observable, action, map, asMap } from 'mobx';
import serverWait from 'mobx-server-wait';
import fetch from 'isomorphic-fetch';
import autobind from 'core-decorators/lib/autobind';

// Default planet response
const defaultPlanet = {
  isLoading: false,
  data: {},
  hasError: false,
};

export default class PlanetStore {

  constructor(state = {}) {
    const { planets, ...rest } = state;
    this.planets = asMap(planets);
    extendObservable(this, rest);
  }

  @observable
  isLoading = false;

  @observable
  hasError = false;

  @observable
  data = [];

  @serverWait
  fetchPlanets() {
    if (!this.isLoading && this.data.length > 0) return;

    this.isLoading = true;
    return fetch('https://swapi.co/api/planets')
    .then(data => data.json())
    .then(action(data => {
      this.isLoading = false;
      this.hasError = false;

      // Change this to match the shape of the API endpoint
      this.data = data.results;
    }))
    .catch(action(err => {
      this.hasError = true;
      this.error = err;
    }));
  }

  @observable
  planets = map();

  @serverWait
  fetchPlanet(id) {
    const { planets } = this;

    if (planets.has(id)) return;

    if (!planets.has(id)) {
      planets.set(id, {
        ...defaultPlanet,
        isLoading: true,
      });
    }

    return fetch(`https://swapi.co/api/planets/${id}`)
    .then(data => data.json())
    .then(action(data => {
      const planet = planets.get(id);
      if (data.detail === 'Not found') {
        throw new Error('Planet not found');
      }
      planet.isLoading = false;
      planet.hasError = false;

      // Change this to match the shape of the API endpoint
      planet.data = data;
    }))
    .catch(action(err => {
      const planet = planets.get(id);
      planet.hasError = true;
      planet.error = err.message;
    }));
  }

  @autobind
  getPlanet(id) {
    return this.planets.get(id) || defaultPlanet;
  }
}
