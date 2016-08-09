import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import AppLayout, { Content as AppLayoutContent } from 'components/appLayout';
import Header from 'components/header';
import Navigation from 'components/navigation';

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
      <AppLayout>
        <Header>
          <Navigation>
            <IndexLink to="/">Home</IndexLink>
            <Link to="/elements">Elements</Link>
            <Link to="/about">About</Link>
          </Navigation>
        </Header>

        <AppLayoutContent>
          {children}
        </AppLayoutContent>
      </AppLayout>
    );
  }
}
