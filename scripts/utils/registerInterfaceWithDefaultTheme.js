import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import DefaultTheme from '../../src/themes/DefaultTheme';

export default function registerInterfaceWithDefaultTheme(reactWithStylesInterface) {
  ThemedStyleSheet.registerInterface(reactWithStylesInterface);
  ThemedStyleSheet.registerTheme(DefaultTheme);
}
