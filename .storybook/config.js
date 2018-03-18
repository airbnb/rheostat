import { configure } from '@storybook/react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import '../css/slider.css';
import '../css/slider-horizontal.css';
import '../css/slider-vertical.css';

function loadStories() {
  require('../stories/ExampleSlider.jsx');
}

Enzyme.configure({ adapter: new Adapter() });
configure(loadStories, module);
