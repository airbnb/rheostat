import PropTypes from 'prop-types';
import React from 'react';

import withBrand from 'airbnb-dls-web/build/themes/withBrand';
import { BRAND_LUXURY, BrandPropType } from 'airbnb-dls-web/build/themes/BrandProvider';
import { withStyles, withStylesPropTypes } from 'airbnb-dls-web/build/themes/withStyles';

import { BACKGROUND_HEIGHT_UNITS } from './constants/SliderConstants';

const propTypes = {
  ...withStylesPropTypes,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  brand: BrandPropType.isRequired,
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
  brand,
  ...passProps
}) {
  const isLuxury = brand === BRAND_LUXURY;
  return (
    <div
      {...css(
        styles.progressBar,
        isLuxury && styles.progressBar_luxury,
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
    borderRadius: BACKGROUND_HEIGHT_UNITS * unit,
  },

  progressBar_luxury: {
    backgroundColor: color.black,
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
    backgroundColor: color.buttons.defaultDisabledColor,
  },
}))(withBrand(DefaultProgressBar));
