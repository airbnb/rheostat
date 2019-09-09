import { StyleSheetTestUtils } from 'aphrodite';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from '../../src/themes/DefaultTheme';

const { WITH_DOM } = process.env;

const MockInterface = {
  create: () => ({}),
  resolve: () => ({}),
  flush: () => {},
};

const stylesInterface = WITH_DOM ? AphroditeInterface : MockInterface;

ThemedStyleSheet.registerTheme(DefaultTheme);
ThemedStyleSheet.registerInterface(stylesInterface);

beforeEach(() => {
  StyleSheetTestUtils.suppressStyleInjection();
});

afterEach(() => new Promise((resolve) => {
  StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  return process.nextTick(resolve);
}));
