import React from 'react';
import ReactDOM from 'react-dom';

import LabeledSlider from '../stories/ExampleSlider';

const element = document.getElementById('root');
if (!element) {
  // Make sure the #root element is defined
  document.body.innerHTML = '<div id="root" />';
}

ReactDOM.render(<LabeledSlider />, element);
