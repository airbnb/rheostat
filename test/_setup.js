import configure from 'enzyme-adapter-react-helper';

configure();

console.error = (arg) => { throw new Error(arg); };
console.warn = (arg) => { throw new Error(arg); };
