import Rheostat from '../';
import React, { PropTypes } from 'react';

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
    return (
      <div style={{
        margin: '10% auto',
        height: '50%',
        width: '50%',
      }}>
        <Rheostat
          {...this.props}
          onValuesChanged={this.updateValue}
          values={this.state.values}
        />
        <ol>
          <lh>Values</lh>
          {this.state.values.map((value, i) => {
            return (
              <li key={i}>
                {this.props.formatValue ? this.props.formatValue(value) : value}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
