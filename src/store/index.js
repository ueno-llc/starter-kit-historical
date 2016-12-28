import { fillServerWait } from 'utils/mobx-server-wait';
import Network from './Network';
import Planets from './Planets';

export default class Store {

  constructor(state = {}) {
    Object.assign(this, state);
    this.network = new Network(this);
    this.planets = new Planets(this);

    // We need to load the promises state from the server.
    fillServerWait(state);
  }

}
