import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import s from './GridOverlay.less';

export default class GridOverlay extends Component {

  static propTypes = {
    columns: PropTypes.number,
  };

  static defaultProps = {
    columns: 12,
  };

  state = {
    isVisible: false,
  };

  componentDidMount() {
    this.componentWillReceiveProps(this.props);

    this.setState({ // eslint-disable-line
      isVisible: localStorage.getItem('uenoStarterKitGridVisible') === 'true',
    });
  }

  componentWillReceiveProps(props) {
    this.gridEl.style.setProperty('--grid-column-count', props.columns);
  }

  onToggle = (e) => {
    if (e) e.preventDefault();

    localStorage.setItem('uenoStarterKitGridVisible', !this.state.isVisible);

    this.setState({
      isVisible: !this.state.isVisible,
    });
  }

  render() {
    const { columns } = this.props;
    const { isVisible } = this.state;

    return (
      <div
        ref={el => { this.gridEl = el; }}
        className={classNames(s.grid, { [s.isVisible]: isVisible })}
      >
        <div className={s.grid__container}>
          <div className={s.grid__row}>
            {Array.from(Array(columns)).map((val = 0, key) => (
              <div key={(val + key)} className={s.grid__column}>
                <div className={s.grid__columnInner} />
              </div>
            ))}
          </div>
        </div>

        <button
          className={s.grid__button}
          onClick={this.onToggle}
        >
          Toggle Grid Overlay
        </button>
      </div>
    );
  }
}
