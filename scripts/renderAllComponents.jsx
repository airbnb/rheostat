import React from 'react';
import ReactDOM from 'react-dom';

import LabeledSlider from '../stories/ExampleSlider';

if (!document.getElementById('root')) {
  // Make sure the #root element is defined
  document.body.innerHTML = '<div id="root" />';
}

ReactDOM.render(<LabeledSlider />, document.getElementById('root'));
