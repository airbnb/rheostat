import { jsdom } from 'jsdom';

global.document = jsdom('');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
