import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/ExampleSlider.jsx');
}

configure(loadStories, module);
