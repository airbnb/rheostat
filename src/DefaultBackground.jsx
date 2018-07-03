import React from 'react';
import { forbidExtraProps } from 'airbnb-prop-types';
import { withStyles, withStylesPropTypes } from 'react-with-styles';
import {
  HORIZONTAL,
  VERTICAL,
} from './constants/SliderConstants';
import OrientationPropType from './propTypes/OrientationPropType';

const propTypes = forbidExtraProps({
  ...withStylesPropTypes,
  orientation: OrientationPropType,
});

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
        styles.DefaultBackground,
        (orientation === VERTICAL
          ? styles.DefaultBackground_background__vertical
          : styles.DefaultBackground_background__horizontal),
      )}
    />
  );
}
DefaultBackground.propTypes = propTypes;
DefaultBackground.defaultProps = defaultProps;

export default withStyles(({ rheostat: { color, unit } }) => ({
  DefaultBackground: {
    backgroundColor: color.white,
    height: (2 * unit) - 1,
    width: '100%',
    border: `1px solid ${color.grey}`,
    position: 'relative',
  },

  DefaultBackground_background__horizontal: {
    height: (2 * unit) - 1,
    top: -2,
    left: -2,
    bottom: 4,
    width: '100%',
  },

  DefaultBackground_background__vertical: {
    width: (2 * unit) - 1,
    top: 0,
    height: '100%',
  },
}))(DefaultBackground);
