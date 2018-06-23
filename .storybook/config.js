import { configure } from '@kadira/storybook';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';

import '../css/slider.css';
import '../css/slider-horizontal.css';
import '../css/slider-vertical.css';

/* Register react with styles interface */
ThemedStyleSheet.registerTheme({
  unit: 30,
  responsive: {},
  color: {
    black: 'black',

    core: {
      babu: '#abc4e8',
    },

    buttons: {
      defaultDisabledColor: 'blue',
    }
  },
});
ThemedStyleSheet.registerInterface(aphroditeInterface);

function loadStories() {
  require('../stories/ExampleSlider.jsx');
}

configure(loadStories, module);
