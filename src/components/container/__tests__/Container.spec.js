/* eslint no-unused-expressions: 0 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Container from '../index.js';
import s from '../Container.styl';

describe('<Container />', () => {

  const container = shallow(<Container />);

  it('should render a div', () => {
    expect(container.hasClass(s.container)).to.be.true;
  });
});
