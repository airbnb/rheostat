import { configure } from '@kadira/storybook';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import registerInterfaceWithDefaultTheme from '../src/utils/registerInterfaceWithDefaultTheme';

/* Register react with styles interface */
registerInterfaceWithDefaultTheme(aphroditeInterface);

function loadStories() {
  require('../stories/ExampleSlider');
}

configure(loadStories, module);
