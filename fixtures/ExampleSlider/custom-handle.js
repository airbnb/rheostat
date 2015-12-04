import React from 'react';

class MyHandle extends React.Component {
  render() {
    return (
      <div
        {...this.props}
        style={Object.assign({}, this.props.style, {
          backgroundColor: 'transparent',
          border: '2px solid crimson',
          borderRadius: '100%',
          cursor: 'ew-resize',
          marginLeft: -13,
          marginTop: -1,
          height: 24,
          width: 24,
          zIndex: 3,
        })}
      />
    )
  }
}

export default {
  handle: MyHandle,
  values: [0, 100],
};
