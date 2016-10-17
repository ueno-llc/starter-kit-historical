import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import s from './Button.less';

export default class Button extends Component {

  static propTypes = {
    to: PropTypes.string,
    alt: PropTypes.bool,
    flat: PropTypes.bool,
    large: PropTypes.bool,
    small: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const {
      to,
      alt,
      flat,
      large,
      small,
      children,
      className,
      ...rest,
    } = this.props;

    rest.className = s('host', className, {
      alt,
      flat,
      large,
      small,
    });

    const isLink = (typeof to !== 'undefined');
    const isExternal = isLink && /^((https?:)?\/\/|[0-9a-zA-Z]+:)/.test(to);

    if (isExternal) {
      return <a href={to} {...rest}>{children}</a>;
    }

    if (isLink) {
      return <Link to={to} {...rest}>{children}</Link>;
    }

    return (
      <button {...rest}>
        {children}
      </button>
    );
  }
}
