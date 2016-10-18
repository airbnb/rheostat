import globalCache from 'global-cache';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import ReactWithStylesThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import { css, withStyles, ThemeProvider } from 'react-with-styles';

import DefaultTheme from './default';

const ThemedStyleSheet = globalCache.setIfMissingThenGet(
  'rheostat withStyles',
  () => {
    // Registering the default theme more than once clobbers all of the
    // previously created styles, which causes errors to happen. This can happen
    // if this file appears in more than one bundle on the same page. To avoid
    // this, we are using a global cache.
    ReactWithStylesThemedStyleSheet.registerDefaultTheme(DefaultTheme);
    ReactWithStylesThemedStyleSheet.registerInterface(aphroditeInterface);
    return ReactWithStylesThemedStyleSheet;
  }
);

export { css, withStyles, ThemeProvider, ThemedStyleSheet };
