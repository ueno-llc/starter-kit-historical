import { Component, PropTypes } from 'react';

export default class Provider extends Component {

  static childContextTypes = {
    store: PropTypes.any,
  };

  static propTypes = {
    store: PropTypes.any,
    children: PropTypes.node,
  };

  getChildContext() {
    const { store } = this.props;
    return {
      store,
    };
  }

  render() {
    return this.props.children;
  }
}
