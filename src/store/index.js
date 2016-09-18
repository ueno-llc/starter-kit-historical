import { extendObservable } from 'mobx';
import { fillServerWait } from 'utils/server-wait';
import PlanetStore from './PlanetStore';

export default class Store {

  constructor(state = {}) {
    extendObservable(this, {
      planets: new PlanetStore(state.planets),
    });

    // We need to load the promises state from the server.
    fillServerWait(state);
  }

}
