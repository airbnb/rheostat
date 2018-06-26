import { configure } from '@kadira/storybook';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';

import DefaultTheme from '../src/themes/DefaultTheme';

import '../css/slider.css';
import '../css/slider-horizontal.css';
import '../css/slider-vertical.css';

/* Register react with styles interface */
ThemedStyleSheet.registerTheme(DefaultTheme);
ThemedStyleSheet.registerInterface(aphroditeInterface);

function loadStories() {
  require('../stories/ExampleSlider.jsx');
}

configure(loadStories, module);
