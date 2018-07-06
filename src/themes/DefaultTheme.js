const core = {
  black: 'black',
  white: '#fcfcfc',
  grey: '#d8d8d8',
  teal: '#abc4e8',
  lightgrey: '#dbdbdb',
};

const DefaultTheme = {
  rheostat: {
    unit: 8,

    responsive: {
      mediumAndAbove: '@media (min-width: 744px)',
      largeAndAbove: '@media (min-width: 1128px)',
    },

    constants: {
      DEFAULT_HANDLE_WIDTH: 1.5,
      BACKGROUND_HEIGHT: 0.25,
    },

    color: {
      ...core,
      progressBar: core.teal,
      focus: core.teal,
      textDisabled: core.lightgrey,

      buttons: {
        defaultDisabledColor: core.lightgrey,
      },
    },
  },
};

export default DefaultTheme;
