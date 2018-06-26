import configure from 'enzyme-adapter-react-helper';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from '../src/themes/DefaultTheme';

configure();

ThemedStyleSheet.registerTheme(DefaultTheme);
ThemedStyleSheet.registerInterface(aphroditeInterface);

console.error = (arg) => { throw new Error(arg); };
console.warn = (arg) => { throw new Error(arg); };
