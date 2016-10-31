import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import UenoLogoSvg from 'assets/images/ueno-logo.svg';
import s from './Header.scss';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <header className={s.header}>
        <div className={s.container}>
          <IndexLink to="/" className={s.logo}>
            <UenoLogoSvg className={s.logo__svg} />
          </IndexLink>

          <div className={s.navigation}>
            {this.props.children}
          </div>
        </div>
      </header>
    );
  }
}
