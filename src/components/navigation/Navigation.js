import React, { Component, PropTypes } from 'react';
import s from './Navigation.less';

export default class Navigation extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <nav className={s.navigation}>
        <ul className={s.navigation__list}>
          {React.Children.map(this.props.children, (component) => (
            <li className={s.navigation__item}>
              {React.cloneElement(component, {
                className: s.navigation__link,
                activeClassName: s.isActive,
              })}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
