import PropTypes from 'prop-types';
import React from 'react';

import { withStyles, withStylesPropTypes } from 'react-with-styles';

const propTypes = {
  ...withStylesPropTypes,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.any,
};

const defaultProps = {
  orientation: 'horizontal',
  disabled: false,
  style: {},
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
        styles.DefaultProgressBar_progressBar,

        ...(orientation === 'vertical'
          ?
            [
              styles.DefaultProgressBar__vertical,
              styles.DefaultProgressBar_background__vertical,
              styles.DefaultProgressBar_progressBar__vertical,
            ]
          :
            [
              styles.DefaultProgressBar_background__horizontal,
              styles.DefaultProgressBar_progressBar__horizontal,
            ]),

        disabled && styles.progressBar_disabled,
      )}
      {...passProps}
    />
  );
}
DefaultProgressBar.propTypes = propTypes;
DefaultProgressBar.defaultProps = defaultProps;

export default withStyles(({ color, unit }) => ({
  DefaultProgressBar__vertical: {
    width: 24,
    height: '100%',
  },

  DefaultProgressBar_progressBar: {
    backgroundColor: '#abc4e8',
    position: 'absolute',
  },

  DefaultProgressBar_background__horizontal: {
    height: 13,
    top: 0,
  },

  DefaultProgressBar_progressBar__horizontal: {
    height: 13,
    top: 2,
  },

  DefaultProgressBar_progressBar__vertical: {
    height: '100%',
    width: 24,
  },

  DefaultProgressBar_background__vertical: {
    height: '100%',
    top: 0,
    width: 15,
  },
}))(DefaultProgressBar);
