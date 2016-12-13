import { observer, inject } from 'mobx-react';

const connect = (...args) => (component) => {

  if (__CLIENT__) {
    return inject(...args)(observer((component)));
  }

  return inject(...args)(component);
};

export default connect;
