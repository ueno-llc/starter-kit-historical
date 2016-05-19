import React, { Component, PropTypes } from 'react';
import s from './App.scss';

/**
 * App container component
 */
export default class App extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  /**
   * Render Method
   * @return {Component}
   */
  render() {
    const { children } = this.props;

    return (
      <div className={s.host}>
        {children}
      </div>
    );
  }
}
