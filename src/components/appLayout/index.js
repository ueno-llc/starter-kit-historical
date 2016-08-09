import React, { Component, PropTypes } from 'react';
import s from './index.less';

export default class AppLayout extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={s.layout}>
        {this.props.children}
      </div>
    );
  }
}

export const Content = ({ children }) => (
  <div className={s.content}>
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node,
};
