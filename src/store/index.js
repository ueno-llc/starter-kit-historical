import { observable, action, extendObservable } from 'mobx';
import { serverWait, serverWaitStore } from 'utils/server-wait';
import fetch from 'isomorphic-fetch';

@serverWaitStore
export default class Store {

  constructor(state = {}) {
    extendObservable(this, state);
  }

  @observable
  planets = {
    isLoading: false,
    data: [],
  };

  @action
  @serverWait({ maxWait: 750 })
  fetchPlanets() {
    this.planets.isLoading = true;
    return fetch('http://swapi.co/api/planets')
    .then(data => data.json())
    .then(action(data => {
      this.planets = {
        isLoading: false,
        data: data.results,
      };
    }));
  }

  @observable
  other = {
    text: 'yeye',
  };

  @action
  @serverWait
  fetchOther() {
    return new Promise(resolve =>
      setTimeout(action(() => {
        this.other.text = 'bleble';
        resolve();
      }), 200)
    );
  }

}
