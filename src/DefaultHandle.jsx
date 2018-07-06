import React from 'react';
import PropTypes from 'prop-types';
import { forbidExtraProps } from 'airbnb-prop-types';
import { withStyles, withStylesPropTypes } from 'react-with-styles';

import { VERTICAL } from './constants/SliderConstants';

import handlePropTypes, { handleDefaultProps } from './propTypes/HandlePropTypes';

export const propTypes = forbidExtraProps({
  ...withStylesPropTypes,
  ...handlePropTypes,
  'aria-valuetext': PropTypes.string,
  'aria-label': PropTypes.string,
});

const defaultProps = {
  ...handleDefaultProps,
  'aria-valuetext': undefined,
  'aria-label': undefined,
};

function DefaultHandle({
  css,
  styles,
  orientation,
  disabled,
  handleRef,
  theme,
  ...passProps
}) {
  return (
    <button
      type="button"
      ref={handleRef}
      {...css(
        styles.DefaultHandle_handle,
        orientation === VERTICAL
          ? styles.DefaultHandle_handle__vertical
          : styles.DefaultHandle_handle__horizontal,
        disabled && styles.DefaultHandle_handle__disabled,
      )}
      {...passProps}
    />
  );
}
DefaultHandle.propTypes = propTypes;

DefaultHandle.defaultProps = defaultProps;

export default withStyles(({ rheostat: { color, unit, constants } }) => ({
  DefaultHandle_handle: {
    width: 2 * constants.DEFAULT_HANDLE_WIDTH * unit,
    height: 2 * constants.DEFAULT_HANDLE_WIDTH * unit,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.grey,
    backgroundColor: color.white,
    borderRadius: '20%',
    outline: 'none',
    zIndex: 2,
    boxShadow: `0 ${unit / 4}px ${unit / 4}px ${color.textDisabled}`,
    ':focus': {
      boxShadow: `${color.focus} 0 0 1px 1px`,
    },

    ':after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      backgroundColor: '#dadfe8',
    },

    ':before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      backgroundColor: '#dadfe8',
    },
  },

  DefaultHandle_handle__horizontal: {
    marginLeft: -12,
    top: -5,
    ':before': {
      top: 7,
      height: 10,
      width: 1,
      left: 10,
    },

    ':after': {
      top: 7,
      height: 10,
      width: 1,
      left: 13,
    },
  },

  DefaultHandle_handle__vertical: {
    marginTop: -(constants.DEFAULT_HANDLE_WIDTH) * unit,
    left: (constants.BACKGROUND_HEIGHT - constants.DEFAULT_HANDLE_WIDTH) * unit,

    ':before': {
      top: 10,
    },

    ':after': {
      top: 13,
      left: 8,
      height: 1,
      width: 10,
    },
  },

  DefaultHandle_handle__disabled: {
    borderColor: color.buttons.defaultDisabledColor,
  },
}))(DefaultHandle);
