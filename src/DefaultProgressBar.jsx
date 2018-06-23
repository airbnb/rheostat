import PropTypes from 'prop-types';
import React from 'react';

import { withStyles, withStylesPropTypes } from 'react-with-styles';

import { BACKGROUND_HEIGHT_UNITS } from './constants/SliderConstants';

const propTypes = {
  ...withStylesPropTypes,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

const defaultProps = {
  orientation: 'horizontal',
  disabled: false,
};

function DefaultProgressBar({
  css,
  styles,
  theme, // eslint-disable-line no-unused-vars
  orientation,
  disabled,
  ...passProps
}) {
  return (
    <div
      {...css(
        styles.progressBar,
        styles.progressBar_background,
        orientation === 'vertical' ? styles.progressBar_vertical : styles.progressBar_horizontal,
        disabled && styles.progressBar_disabled,
      )}
      {...passProps}
    />
  );
}
DefaultProgressBar.propTypes = propTypes;
DefaultProgressBar.defaultProps = defaultProps;

export default withStyles(({ color, unit }) => ({
  progressBar: {
    backgroundColor: color.core.babu,
    position: 'absolute',
  },

  progressBar_background: {
    height: 15,
    top: 0,
    width: '100%',
  },

  progressBar_horizontal: {
    height: BACKGROUND_HEIGHT_UNITS * unit,
    top: 2,
  },

  // progressBar_vertical: {
  //   width: BACKGROUND_HEIGHT_UNITS * unit,
  //   left: 0,
  //   width: 100,
  // },

  progressBar_disabled: {
    backgroundColor: color.buttons.defaultDisabledColor,
  },

}))(DefaultProgressBar);
