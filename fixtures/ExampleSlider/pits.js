import React from 'react';

class PitComponent extends React.Component {
  render() {
    return (
      <div
        style={Object.assign({}, this.props.style, {
          background: '#a2a2a2',
          width: 1,
          height: this.props.children % 10 === 0 ? 12 : 8,
          top: 20,
        })}
      />
    );
  }
}

export default {
  pitComponent: PitComponent,
  pitPoints: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
  snap: true,
  snapPoints: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  values: [40, 80],
};
