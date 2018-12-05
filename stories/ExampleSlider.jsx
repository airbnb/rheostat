import React from 'react';
import { storiesOf } from '@kadira/storybook';
import PropTypes from 'prop-types';

import Rheostat from '../src/Slider';
import log10 from '../src/algorithms/log10';

export default class LabeledSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: props.values || [0],
    };

    this.updateValue = this.updateValue.bind(this);
  }

  updateValue(sliderState) {
    this.setState({
      values: sliderState.values,
    });
  }

  render() {
    const { formatValue, ...passProps } = this.props;
    const { values } = this.state;

    return (
      <div
        style={{
          margin: '10% auto',
          height: '50%',
          width: '50%',
        }}
      >
        <Rheostat
          {...passProps}
          onValuesUpdated={this.updateValue}
          values={values}
        />
        <ol>
          <lh>Values</lh>
          {values.map(value => (
            <li key={value}>
              {formatValue ? formatValue(value) : value}
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
LabeledSlider.propTypes = {
  values: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  formatValue: PropTypes.func,
};
LabeledSlider.defaultProps = {
  values: null,
  formatValue: null,
};

storiesOf('Slider', module)
  .add('A Simple Slider', () => (
    <LabeledSlider />
  ))
  .add('Custom Handle', () => {
    function MyHandle({ style, handleRef, ...passProps }) {
      return (
        <div
          ref={handleRef}
          {...passProps}
          style={{
            ...style,
            backgroundColor: 'rgba(0, 15, 137, 0.5)',
            border: '1px solid #000f89',
            borderRadius: '100%',
            cursor: 'ew-resize',
            marginLeft: -13,
            height: 24,
            width: 24,
            zIndex: 3,
          }}
        />
      );
    }
    MyHandle.propTypes = {
      style: PropTypes.object,
      handleRef: PropTypes.any,
    };
    MyHandle.defaultProps = {
      style: null,
      handleRef: '',
    };

    return (
      <LabeledSlider
        handle={MyHandle}
        values={[0, 100]}
      />
    );
  })
  .add('Custom Background', () => {
    function MyBackground({ style }) {
      return (
        <div
          style={{
            ...style,
            backgroundColor: '#000',
            height: 13,
          }}
        />
      );
    }
    MyBackground.propTypes = {
      style: PropTypes.object,
    };
    MyBackground.defaultProps = {
      style: null,
    };

    return (
      <LabeledSlider
        background={MyBackground}
        values={[30]}
      />
    );
  })
  .add('Dates', () => {
    const startDate = new Date('01-01-2015').valueOf();
    const endDate = new Date('12-31-2015').valueOf();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function ordinal(n) {
      const rem = n < 10 || n > 20 ? n % 10 : 0;
      if (rem === 1) {
        return `${n}st`;
      }

      if (rem === 2) {
        return `${n}nd`;
      }

      if (rem === 3) {
        return `${n}rd`;
      }

      return `${n}th`;
    }

    return (
      <LabeledSlider
        min={startDate}
        max={endDate}
        formatValue={(value) => {
          const date = new Date(value);
          return `${months[date.getMonth()]} ${ordinal(date.getDate())}`;
        }}
        values={[startDate]}
      />
    );
  })
  .add('Large scale', () => (
    <LabeledSlider
      min={1}
      max={1000000}
      values={[1]}
    />
  ))
  .add('Large scale (with many handles)', () => (
    <LabeledSlider
      min={1}
      max={1000000}
      values={[1, 250000, 500000, 750000, 1000000]}
    />
  ))
  .add('Logarithmic scale', () => (
    <LabeledSlider
      algorithm={log10}
      min={1}
      max={1000}
      values={[100]}
    />
  ))
  .add('Medium scale', () => (
    <LabeledSlider
      min={1}
      max={40}
      values={[10]}
    />
  ))
  .add('Pits', () => {
    function PitComponent({ style, children }) {
      return (
        <div
          style={{
            ...style,
            background: '#a2a2a2',
            width: 1,
            height: children % 10 === 0 ? 12 : 8,
            top: 20,
          }}
        />
      );
    }
    PitComponent.propTypes = {
      style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
      children: PropTypes.number,
    };
    PitComponent.defaultProps = {
      style: null,
      children: null,
    };

    return (
      <LabeledSlider
        pitComponent={PitComponent}
        pitPoints={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]} // eslint-disable-line max-len
        snap
        snapPoints={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        values={[40, 80]}
      />
    );
  })
  .add('Small scale (snap)', () => (
    <LabeledSlider
      max={5}
      min={1}
      snap
      values={[3]}
    />
  ))
  .add('Snapping', () => (
    <LabeledSlider
      snap
      snapPoints={[20, 40, 60, 80]}
    />
  ))
  .add('Vertical', () => (
    <LabeledSlider orientation="vertical" />
  ))
  .add('Disabled', () => (
    <LabeledSlider disabled />
  ));
