import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import ReactWithStylesThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';

import DefaultTheme from './default';

export default function initializeTheme() {
  ReactWithStylesThemedStyleSheet.registerDefaultTheme(DefaultTheme);
  ReactWithStylesThemedStyleSheet.registerInterface(aphroditeInterface);
}
