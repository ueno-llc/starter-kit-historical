import React, { Component, PropTypes } from 'react';
import Container from 'container/Container';
import s from './App.less';

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
        <Container>
          {children}
        </Container>
      </div>
    );
  }
}
