import { configure } from '@kadira/storybook';
import initializeTheme from '../theme/initializeTheme';

initializeTheme();

function loadStories() {
  require('../stories/ExampleSlider.jsx');
}

configure(loadStories, module);
