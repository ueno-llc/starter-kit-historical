import { observable, action, extendObservable } from 'mobx';
import serverWait from 'utils/server-wait';
import fetch from 'isomorphic-fetch';

export default class PlanetStore {

  constructor(state = {}) {
    extendObservable(this, state);
  }

  @observable
  isLoading = false;

  @observable
  data = [];

  @action
  @serverWait
  fetchPlanets() {
    this.isLoading = true;
    return fetch('http://swapi.co/api/planets')
    .then(data => data.json())
    .then(action(data => {
      this.isLoading = false;
      this.data = data.results;
    }));
  }
}
