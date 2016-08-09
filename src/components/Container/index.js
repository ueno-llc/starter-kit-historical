import React, { Component, PropTypes } from 'react';
import s from './Container.less';

/**
 * Container component
 */
export default class Container extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  /**
   * Render method
   * @return {Component}
   */
  render() {
    return (
      <div className={s.container}>
        {this.props.children}
      </div>
    );
  }
}
