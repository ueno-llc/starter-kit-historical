import React, { Component, PropTypes } from 'react';
import s from './Header.less';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={s.header}>
        <div className={s.container}>
          <a className={s.logo}>UENO. Starter kit</a>

          <div className={s.navigation}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
