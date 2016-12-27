import { fillServerWait } from 'mobx-server-wait';
import Network from './Network';

export default class Store {

  constructor(state = {}) {
    Object.assign(this, state);
    this.network = new Network(this);

    // We need to load the promises state from the server.
    fillServerWait(state);
  }

}
