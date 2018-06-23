/*
  This component is the same as https://github.com/airbnb/rheostat. We include it in dls-web/team
  for two reasons:

    1. We have https://github.com/airbnb/rheostat/pull/38 on hold until we have a good solution for
       generated css for our open-source projects using react-with-styles. Maja is spearheading this
       for use with react-dates.
    2. We want to test the existing rheostat side-by-side with the new, and NPM will not allow us to
       include two versions of the same dependency in monorail.

  Once these two issues are resolved, we can just bump the version of rheostat and use it directly.
*/

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, withStylesPropTypes } from 'react-with-styles';

import { DEFAULT_HANDLE_WIDTH_UNITS, BACKGROUND_HEIGHT_UNITS } from './constants/SliderConstants';
import handlePropTypes, { handleDefaultProps } from './propTypes/HandlePropTypes';

export const propTypes = {
  ...withStylesPropTypes,
  ...handlePropTypes,
  'aria-valuetext': PropTypes.string,
  'aria-label': PropTypes.string,
  getLabel: PropTypes.func,
};

const defaultProps = {
  ...handleDefaultProps,
  'aria-valuetext': undefined,
  'aria-label': undefined,
  getLabel: undefined,
};

function DefaultHandle({
  css, styles, orientation, disabled, ...passProps
}) {
  const {
    handleRef, theme, getLabel, ...rest
  } = passProps; // eslint-disable-line no-unused-vars
  return (
    <button
      ref={handleRef}
      {...css(
        styles.handle,
        orientation === 'vertical' ? styles.handle_vertical : styles.handle_horizontal,
        disabled && styles.handle_disabled,
      )}
      {...rest}
    />
  );
}
DefaultHandle.propTypes = {
  ...propTypes,
};

DefaultHandle.defaultProps = defaultProps;

export function customHandleWithStyles(customHandle) {
  return withStyles(({ color, unit }) => ({
    handle: {
      width: DEFAULT_HANDLE_WIDTH_UNITS * unit,
      height: DEFAULT_HANDLE_WIDTH_UNITS * unit,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: color.core.babu,
      backgroundColor: color.white,
      borderRadius: DEFAULT_HANDLE_WIDTH_UNITS * unit,
      outline: 'none',
      zIndex: 2,
      boxShadow: `0 ${unit / 4}px ${unit / 4}px ${color.textDisabled}`,
      ':focus': {
        boxShadow: `${color.focus} 0 0 2px 2px`,
      },
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
      borderColor: color.buttons.defaultDisabledColor,
    },
  }))(customHandle);
}

export default customHandleWithStyles(DefaultHandle);
