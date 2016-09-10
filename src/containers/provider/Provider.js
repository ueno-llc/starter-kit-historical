import { Component, PropTypes } from 'react';

export default class Provider extends Component {

  static childContextTypes = {
    router: () => {},
    history: () => {},
    actions: () => {},
    action: () => {},
    state: () => {},
    store: () => {},
  };

  static propTypes = {
    context: PropTypes.any,
    children: PropTypes.node,
  };

  getChildContext() {
    return this.props.context;
  }

  render() {
    return this.props.children;
  }
}
