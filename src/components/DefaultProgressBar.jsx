import React, { PropTypes } from 'react';
import { css, withStyles } from 'react-with-styles';

import { BACKGROUND_HEIGHT_UNITS } from '../constants/SliderConstants';

const propTypes = {
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  styles: PropTypes.object,
};

const defaultProps = {
  orientation: 'horizontal',
  disabled: false,
  styles: {},
};

class DefaultProgressBar extends React.Component {
  render() {
    const { styles, orientation, disabled, ...passProps } = this.props;
    return (
      <div
        {...css(
          styles.progressBar,
          orientation === 'vertical' ? styles.progressBar_vertical : styles.progressBar_horizontal,
          disabled && styles.progressBar_disabled
        )}
        {...passProps}
      />
    );
  }
}
DefaultProgressBar.propTypes = propTypes;
DefaultProgressBar.defaultProps = defaultProps;

export default withStyles(({ color, unit }) => ({
  progressBar: {
    backgroundColor: color.sliderBackgroundActive,
    position: 'absolute',
    borderRadius: BACKGROUND_HEIGHT_UNITS * unit,
  },

  progressBar_horizontal: {
    height: BACKGROUND_HEIGHT_UNITS * unit,
    top: 0,
  },

  progressBar_vertical: {
    width: BACKGROUND_HEIGHT_UNITS * unit,
    left: 0,
  },

  progressBar_disabled: {
    backgroundColor: color.sliderBackgroundDisabled,
  },
}))(DefaultProgressBar);
