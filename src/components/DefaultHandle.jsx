import React, { PropTypes } from 'react';
import { css, withStyles } from 'react-with-styles';

import { DEFAULT_HANDLE_WIDTH_UNITS, BACKGROUND_HEIGHT_UNITS } from '../constants/SliderConstants';

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

class DefaultHandle extends React.Component {
  render() {
    const { styles, orientation, disabled, ...passProps } = this.props;
    return (
      <button
        {...css(
          styles.handle,
          orientation === 'vertical' ? styles.handle_vertical : styles.handle_horizontal,
          disabled && styles.handle_disabled
        )}
        {...passProps}
      />
    );
  }
}
DefaultHandle.propTypes = propTypes;
DefaultHandle.defaultProps = defaultProps;

export default withStyles(({ color, unit }) => ({
  handle: {
    width: DEFAULT_HANDLE_WIDTH_UNITS * unit,
    height: DEFAULT_HANDLE_WIDTH_UNITS * unit,
    borderWidth: unit / 4,
    borderStyle: 'solid',
    borderColor: color.sliderButtonBorder,
    backgroundColor: color.sliderWhite,
    borderRadius: DEFAULT_HANDLE_WIDTH_UNITS * unit,
    outline: 'none',
    zIndex: 2,
    boxShadow: `0 ${unit / 4}px ${unit / 4}px ${color.sliderShadow}`,
  },

  handle_horizontal: {
    marginLeft: -(DEFAULT_HANDLE_WIDTH_UNITS / 2) * unit,
    top: ((BACKGROUND_HEIGHT_UNITS / 2) - (DEFAULT_HANDLE_WIDTH_UNITS / 2)) * unit,
  },

  handle_vertical: {
    marginTop: -(DEFAULT_HANDLE_WIDTH_UNITS / 2) * unit,
    left: ((BACKGROUND_HEIGHT_UNITS / 2) - (DEFAULT_HANDLE_WIDTH_UNITS / 2)) * unit,
  },

  handle_disabled: {
    borderColor: color.sliderButtonBorderDisabled,
  },
}))(DefaultHandle);
