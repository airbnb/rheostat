import { configure } from '@storybook/react';
import registerCSSInterfaceWithDefaultTheme from '../src/utils/registerCSSInterfaceWithDefaultTheme';

import '../css/rheostat.css';

/* Register react with styles interface */
registerCSSInterfaceWithDefaultTheme();

function loadStories() {
  require('../stories/ExampleSlider');
}

configure(loadStories, module);
