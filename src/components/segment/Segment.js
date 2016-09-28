import React, { Component, PropTypes } from 'react';
import Container from 'components/container';
import classNames from './Segment.less';

/**
 * Segment component
 */
export default class Segment extends Component {

  static propTypes = {
    compact: PropTypes.bool,
    children: PropTypes.node,
  };

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const {
      children,
      compact,
    } = this.props;

    return (
      <section className={classNames('segment', { compact })}>
        <Container>
          {children}
        </Container>
      </section>
    );
  }
}
