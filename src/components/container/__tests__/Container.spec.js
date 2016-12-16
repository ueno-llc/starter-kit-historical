/* eslint no-unused-expressions: 0 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Container from '../index';
import s from '../Container.scss';

describe('<Container />', () => {

  const container = shallow(<Container />);

  it('should render a div', () => {
    expect(container.hasClass(s.container)).to.be.true;
  });
});
