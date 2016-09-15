import React, { Component } from 'react';
import connect from 'utils/connect';

@connect
export default class MyComponent extends Component {

  componentWillMount() {
    this.context.store.fetchOther();
  }

  render() {
    const { other } = this.context.store;
    return (
      <div>{other.text}</div>
    );
  }
}
