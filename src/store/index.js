import { fillServerWait } from 'mobx-server-wait';
import PlanetStore from './PlanetStore';

export default class Store {

  constructor(state = {}) {
    const { planets, ...rest } = state;
    this.planets = new PlanetStore(planets);
    Object.assign(this, rest);

    // We need to load the promises state from the server.
    fillServerWait(state);
  }

}
