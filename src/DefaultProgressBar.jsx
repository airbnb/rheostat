import PropTypes from 'prop-types';
import { forbidExtraProps } from 'airbnb-prop-types';
import React from 'react';
import { withStyles, withStylesPropTypes } from 'react-with-styles';

import {
  HORIZONTAL,
  VERTICAL,
} from './constants/SliderConstants';


const propTypes = forbidExtraProps({
  ...withStylesPropTypes,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
});

const defaultProps = {
  orientation: HORIZONTAL,
  disabled: false,
  style: {},
};

function DefaultProgressBar({
  css,
  styles,
  theme,
  orientation,
  disabled,
  ...passProps
}) {
  return (
    <div
      {...css(
        styles.DefaultProgressBar_progressBar,

        ...(orientation === VERTICAL
          ? [
            styles.DefaultProgressBar__vertical,
            styles.DefaultProgressBar_background__vertical,
            styles.DefaultProgressBar_progressBar__vertical,
          ] : [
            styles.DefaultProgressBar_background__horizontal,
          ]),

        disabled && styles.progressBar_disabled,
      )}
      {...passProps}
    />
  );
}
DefaultProgressBar.propTypes = propTypes;
DefaultProgressBar.defaultProps = defaultProps;

export default withStyles(({ rheostat: { color, unit } }) => ({
  DefaultProgressBar__vertical: {
    width: 3 * unit,
    height: '100%',
  },

  DefaultProgressBar_progressBar: {
    backgroundColor: color.progressBar,
    position: 'absolute',
  },

  DefaultProgressBar_progressBar__vertical: {
    height: '100%',
    width: 3 * unit,
  },

  DefaultProgressBar_background__vertical: {
    height: '100%',
    top: 0,
    width: (2 * unit) - 1,
  },

  DefaultProgressBar_background__horizontal: {
    height: (2 * unit) - 3,
    top: 0,
  },
}))(DefaultProgressBar);
