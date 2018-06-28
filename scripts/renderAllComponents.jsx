import React from 'react';
import ReactDOM from 'react-dom';

import LabeledSlider from '../stories/ExampleSlider';

function App() {
  return (
    <LabeledSlider />
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
