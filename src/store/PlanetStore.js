import { observable, action, extendObservable, map, asMap } from 'mobx';
import serverWait from 'utils/server-wait';
import fetch from 'isomorphic-fetch';

export default class PlanetStore {

  constructor(state = {}) {
    extendObservable(this, {
      ...state,
      planets: asMap(state.planets),
    });
  }

  @observable
  isLoading = false;

  @observable
  data = [];

  @action
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

  @action
  @serverWait
  fetchPlanet(id) {
    const { planets } = this;

    if (planets.has(id)) return;

    if (!planets.has(id)) {
      planets.set(id, { isLoading: true, data: {} });
    }

    return fetch(`http://swapi.co/api/planets/${id}`)
    .then(data => data.json())
    .then(action(data => {
      planets.set(id, {
        isLoading: false,
        data,
      });
    }));
  }

  getPlanet(id) {
    return this.planets.get(id) || {
      isLoading: true,
      data: {},
    };
  }

}
