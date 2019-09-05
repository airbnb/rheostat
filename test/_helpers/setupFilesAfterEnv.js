import { StyleSheetTestUtils } from 'aphrodite';
import { StyleSheetTestUtils as NoImportantStyleSheetTestUtils } from 'aphrodite/no-important';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from '../../src/themes/DefaultTheme';

ThemedStyleSheet.registerTheme(DefaultTheme);
ThemedStyleSheet.registerInterface(aphroditeInterface);

beforeEach(() => {
  StyleSheetTestUtils.suppressStyleInjection();
  NoImportantStyleSheetTestUtils.suppressStyleInjection();
});

afterEach(() => new Promise((resolve) => {
  StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  NoImportantStyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  return process.nextTick(resolve);
}));
