import React, { Component, PropTypes } from 'react';
import s from './AppLayout.less';

export default class AppLayout extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={s.layout}>
        {this.props.children}
      </div>
    );
  }
}
