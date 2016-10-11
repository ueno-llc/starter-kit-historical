import React, { Component, PropTypes } from 'react';
import s from './Header.less';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <header className={s.header}>
        <div className={s.container}>
          <a className={s.logo}>ueno. Starter kit</a>

          <div className={s.navigation}>
            {this.props.children}
          </div>
        </div>
      </header>
    );
  }
}
