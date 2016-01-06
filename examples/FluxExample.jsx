import Rheostat from '../';
import Alt from 'alt';
import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

const alt = new Alt();

const SliderActions = alt.generateActions(
  'sliderValuesChanged',
  'valuesChanged'
);

const ValueStore = alt.createStore({
  displayName: 'ValueStore',

  state: {
    min: 0,
    max: 100,
    values: [0, 100],
  },

  bindListeners: {
    sliderValuesChanged: SliderActions.sliderValuesChanged,
    valuesChanged: SliderActions.valuesChanged,
  },

  sliderValuesChanged(state) {
    this.setState({
      min: Number(state.min),
      max: Number(state.max),
      values: state.values.split(',').map(Number),
    });
  },

  valuesChanged(values) {
    this.setState({ values });
  },
});


class FluxExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      min: props.min,
      max: props.max,
      values: props.values,
    };

    this.changeMin = this.changeMin.bind(this);
    this.changeMax = this.changeMax.bind(this);
    this.changeValues = this.changeValues.bind(this);
    this.valuesChanged = this.valuesChanged.bind(this);
    this.applyChanges = this.applyChanges.bind(this);
  }

  changeMin(ev) {
    this.setState({
      min: ev.target.value,
    });
  }

  changeMax(ev) {
    this.setState({
      max: ev.target.value,
    });
  }

  changeValues(ev) {
    this.setState({
      values: ev.target.value,
    });
  }

  valuesChanged(state) {
    this.setState({
      values: String(state.values),
    });
  }

  applyChanges() {
    SliderActions.sliderValuesChanged(this.state);
  }

  render() {
    return (
      <div style={{
        margin: '10% auto',
        width: '50%',
      }}>
        <Rheostat
          {...this.props}
          onValuesUpdated={this.valuesChanged}
        />
        <div>
          <h3>Change the values</h3>
          <p>
            <label>
              Min
              <input value={this.state.min} onChange={this.changeMin} />
            </label>
          </p>
          <p>
            <label>
              Max
              <input value={this.state.max} onChange={this.changeMax} />
            </label>
          </p>
          <p>
            <label>
              Values
              <input value={this.state.values} onChange={this.changeValues} />
            </label>
          </p>

          <button onClick={this.applyChanges}>Apply Changes</button>
        </div>
      </div>
    );
  }
}

export default connectToStores({
  getStores() {
    return [ValueStore];
  },

  getPropsFromStores() {
    return ValueStore.getState();
  },
}, FluxExample);
