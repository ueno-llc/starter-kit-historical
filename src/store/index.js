import { observable, action, extendObservable } from 'mobx';
import FetchStore from './FetchStore';

export default class Store {

  constructor(state = {}) {
    extendObservable(this, {
      ...state,
      fetch: new FetchStore(state.fetch),
    });
  }

  @observable
  planets = {
    isLoading: false,
    data: [],
  };

  @action
  fetchPlanets() {
    this.planets.isLoading = true;
    this.fetch.fetch('http://swapi.co/api/planets')
    .then(data => data.json())
    .then(action(data => {
      this.planets = {
        isLoading: false,
        data: data.results,
      };
    }));
  }

}
