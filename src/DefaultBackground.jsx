import React from 'react';
import { withStyles, withStylesPropTypes } from 'react-with-styles';
import {
  BACKGROUND_HEIGHT_UNITS,
  HORIZONTAL,
  VERTICAL,
} from './constants/SliderConstants';
import OrientationPropType from './propTypes/OrientationPropType';

const propTypes = {
  ...withStylesPropTypes,
  // the orientation
  orientation: OrientationPropType,
};

const defaultProps = {
  orientation: HORIZONTAL,
};

function DefaultBackground({
  css,
  orientation,
  styles,
}) {
  return (
    <div
      {...css(
        styles.DefaultBackground_background,
        orientation === VERTICAL ? styles.DefaulBackground_background__vertical : styles.DefaulBackground_background__horizontal
      )}
    />
  );
}
DefaultBackground.propTypes = propTypes;
DefaultBackground.defaultProps = defaultProps;

export default withStyles(({ color, unit }) => ({
  DefaultBackground_background: {
    background: color.accent.lightGray,
    border: '1px solid red',
    position: 'relative',
    overflow: 'visible',
    borderRadius: BACKGROUND_HEIGHT_UNITS * unit,
  },

  DefaulBackground_background__horizontal: {
    height: 15,
    top: 0,
    width: '100%',
  },

  DefaulBackground_background__vertical: {
    width: 15,
    top: 0,
    height: '100%',
  },
}))(DefaultBackground);
