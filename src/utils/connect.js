/* eslint no-param-reassign: [0] */
import { PropTypes } from 'react';
import { observer } from 'mobx-react';

const connect = (component) => {

  component.contextTypes = {
    store: PropTypes.object,
  };

  if (__CLIENT__) {
    return observer(component);
  }

  return component;
};

export default connect;
