import configure from 'enzyme-adapter-react-helper';

configure();

function skipError(arg) {
  return arg && /^Warning: componentWillReceiveProps has been renamed,/.test(arg);
}

/* eslint-disable no-console */
console.error = (arg) => { if (!skipError(arg)) { throw new Error(arg); } };
console.warn = (arg) => { if (!skipError(arg)) { throw new Error(arg); } };
/* eslint-enable no-console */
