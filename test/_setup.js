import configure from 'enzyme-adapter-react-helper';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from '../src/themes/DefaultTheme';

configure();

ThemedStyleSheet.registerTheme(DefaultTheme);
ThemedStyleSheet.registerInterface(aphroditeInterface);

function skipError(arg) {
  return arg && /^Warning: componentWillReceiveProps has been renamed,/.test(arg);
}

console.error = (arg) => { if (!skipError(arg)) { throw new Error(arg); } };
console.warn = (arg) => { if (!skipError(arg)) { throw new Error(arg); } };
