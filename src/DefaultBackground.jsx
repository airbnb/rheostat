import React from 'react';
import { withStyles, withStylesPropTypes } from 'react-with-styles';
import {
  HORIZONTAL,
  VERTICAL,
} from './constants/SliderConstants';
import OrientationPropType from './propTypes/OrientationPropType';

const propTypes = {
  ...withStylesPropTypes,
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
      {...css(orientation === VERTICAL
        ? styles.DefaulBackground_background__vertical
        : styles.DefaulBackground_background__horizontal)}
    />
  );
}
DefaultBackground.propTypes = propTypes;
DefaultBackground.defaultProps = defaultProps;

export default withStyles(({ color, unit }) => ({
  DefaultBackground_background: {
    backgroundColor: '#fcfcfc',
    border: '5px solid #d8d8d8',
    position: 'relative',
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
