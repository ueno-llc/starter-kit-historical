import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Container from 'components/container/Container';
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
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Container>
          {children}
        </Container>
      </div>
    );
  }
}
