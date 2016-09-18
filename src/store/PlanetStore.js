import { observable, action, extendObservable, map, asMap } from 'mobx';
import serverWait from 'utils/server-wait';
import fetch from 'isomorphic-fetch';

export default class PlanetStore {

  constructor(state = {}) {
    extendObservable(this, {
      planets: asMap(state.planets),
    });
  }

  @observable
  isLoading = false;

  @observable
  data = [];

  @serverWait
  fetchPlanets() {
    if (!this.isLoading && this.data.length > 0) return;

    this.isLoading = true;
    return fetch('http://swapi.co/api/planets')
    .then(data => data.json())
    .then(action(data => {
      this.isLoading = false;
      this.data = data.results;
    }));
  }

  @observable
  planets = map();

  @serverWait
  fetchPlanet(id) {
    const { planets } = this;

    if (planets.has(id)) return;

    if (!planets.has(id)) {
      planets.set(id, { isLoading: true, data: {}, hasError: false });
    }

    return fetch(`http://swapi.co/api/planets/${id}`)
    .then(data => data.json())
    .then(action(data => {
      const planet = planets.get(id);
      if (data.detail === 'Not found') {
        return (planet.hasError = true);
      }
      planet.isLoading = false;
      planet.data = data;
    }));
  }

  getPlanet(id) {
    return this.planets.get(id) || {
      isLoading: true,
      data: {},
      hasError: null,
    };
  }

}
