/* eslint no-param-reassign: [0] */
import { PropTypes } from 'react';
import { observer } from 'mobx-react';

const connect = (component) => {

  const oldComponentDidMount = component.prototype.componentDidMount;

  component.contextTypes = {
    store: PropTypes.object,
  };

  // component.prototype.componentDidMount = function componentDidMount(...args) {
  //   const { store } = this.context;
  //   const promise = store.requests.requests[component.name];
  //
  //   if (!promise || (promise && promise.state !== 'fulfilled')) {
  //     component.fetchData(store, this.props);
  //   }
  //
  //   if (oldComponentDidMount) {
  //     return oldComponentDidMount.call(this, ...args);
  //   }
  // };

  if (__CLIENT__) {
    return observer(component);
  }

  return component;
};

export default connect;
