import { observable, extendObservable, action } from 'mobx';
import { fromPromise } from 'mobx-utils';

export default class FetchStore {

  constructor(state = {}) {

    extendObservable(this, {
      requests: state.requests || {},
    });
  }

  @observable
  requests = {};

  @action
  fetch(url) {
    return fetch(url);
  }
}
