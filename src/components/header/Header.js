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
        <div className={s.header__container}>
          <div className={s.header__content}>
            <IndexLink to="/" className={s.header__logo}>
              <UenoLogoSvg className={s.header__logoSvg} />
            </IndexLink>

            <div className={s.header__navigation}>
              {this.props.children}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
