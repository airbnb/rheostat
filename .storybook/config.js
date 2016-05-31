import { configure } from '@kadira/storybook';

import '../css/slider.css';
import '../css/slider-horizontal.css';
import '../css/slider-vertical.css';

function loadStories() {
  require('../stories/ExampleSlider.jsx');
}

configure(loadStories, module);
