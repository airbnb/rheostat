import { withStyles, withStylesPropTypes } from 'react-with-styles';
import PropTypes from 'prop-types';
import { forbidExtraProps } from 'airbnb-prop-types';
import React from 'react';

import LinearScale from './algorithms/linear';
import DefaultHandle from './DefaultHandle';
import DefaultProgressBar from './DefaultProgressBar';
import DefaultBackground from './DefaultBackground';
import OrientationPropType from './propTypes/OrientationPropType';

import {
  HORIZONTAL,
  VERTICAL,
  PERCENT_FULL,
  PERCENT_EMPTY,
  KEYS,
} from './constants/SliderConstants';

const has = Object.prototype.hasOwnProperty;

const PropTypeArrOfNumber = PropTypes.arrayOf(PropTypes.number);
const PropTypeReactComponent = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

function getHandleFor(ev) {
  return Number(ev.currentTarget.getAttribute('data-handle-key'));
}

function killEvent(ev) {
  ev.stopPropagation();
  ev.preventDefault();
}

const propTypes = forbidExtraProps({
  ...withStylesPropTypes,

  // Automatically adds a top position for large when enabled
  autoAdjustVerticalPosition: PropTypes.bool,

  // the algorithm to use
  algorithm: PropTypes.shape({
    getValue: PropTypes.func,
    getPosition: PropTypes.func,
  }),

  background: PropTypeReactComponent,

  // any children you pass in
  children: PropTypes.node,

  // prevent the slider from moving when clicked
  disabled: PropTypes.bool,

  // a custom handle you can pass in
  handle: PropTypeReactComponent,

  // the maximum possible value
  max: PropTypes.number,

  // the minimum possible value
  min: PropTypes.number,

  // called on click
  onClick: PropTypes.func,

  // called whenever the user is done changing values on the slider
  onChange: PropTypes.func,

  // called on key press
  onKeyPress: PropTypes.func,

  // called when you finish dragging a handle
  onSliderDragEnd: PropTypes.func,

  // called every time the slider is dragged and the value changes
  onSliderDragMove: PropTypes.func,

  // called when you start dragging a handle
  onSliderDragStart: PropTypes.func,

  // called whenever the user is actively changing the values on the slider
  // (dragging, clicked, keypress)
  onValuesUpdated: PropTypes.func,

  // the orientation
  orientation: OrientationPropType,

  // a component for rendering the pits
  pitComponent: PropTypeReactComponent,

  // the points that pits are rendered on
  pitPoints: PropTypeArrOfNumber,

  // a custom progress bar you can pass in
  progressBar: PropTypeReactComponent,

  // should we snap?
  snap: PropTypes.bool,
  // the points we should snap to
  snapPoints: PropTypeArrOfNumber,
  // whether a proposed update is valid
  getNextHandlePosition: PropTypes.func,

  // the values
  values: PropTypeArrOfNumber,
});

const defaultProps = {
  autoAdjustVerticalPosition: false,
  children: null,
  algorithm: LinearScale,
  disabled: false,
  getNextHandlePosition: null,
  max: PERCENT_FULL,
  min: PERCENT_EMPTY,
  onClick: null,
  onChange: null,
  onKeyPress: null,
  onSliderDragEnd: null,
  onSliderDragMove: null,
  onSliderDragStart: null,
  onValuesUpdated: null,
  orientation: HORIZONTAL,
  pitComponent: null,
  pitPoints: [],
  snap: false,
  snapPoints: [],
  background: DefaultBackground,
  handle: DefaultHandle,
  progressBar: DefaultProgressBar,
  values: [
    PERCENT_EMPTY,
  ],
};

class Rheostat extends React.Component {
  constructor(props) {
    super(props);

    const {
      algorithm,
      max,
      min,
      values,
    } = this.props;

    this.state = {
      handlePos: values.map(value => algorithm.getPosition(value, min, max)),
      handleDimensions: 0,
      slidingIndex: null,
      values,
    };

    this.getPublicState = this.getPublicState.bind(this);
    this.getSliderBoundingBox = this.getSliderBoundingBox.bind(this);
    this.getProgressStyle = this.getProgressStyle.bind(this);
    this.getMinValue = this.getMinValue.bind(this);
    this.getMaxValue = this.getMaxValue.bind(this);
    this.getHandleDimensions = this.getHandleDimensions.bind(this);
    this.getClosestSnapPoint = this.getClosestSnapPoint.bind(this);
    this.getSnapPosition = this.getSnapPosition.bind(this);
    this.getNextPositionForKey = this.getNextPositionForKey.bind(this);
    this.getNextState = this.getNextState.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getClosestHandle = this.getClosestHandle.bind(this);
    this.setStartSlide = this.setStartSlide.bind(this);
    this.startMouseSlide = this.startMouseSlide.bind(this);
    this.startTouchSlide = this.startTouchSlide.bind(this);
    this.handleMouseSlide = this.handleMouseSlide.bind(this);
    this.handleTouchSlide = this.handleTouchSlide.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
    this.endSlide = this.endSlide.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.validatePosition = this.validatePosition.bind(this);
    this.validateValues = this.validateValues.bind(this);
    this.canMove = this.canMove.bind(this);
    this.fireChangeEvent = this.fireChangeEvent.bind(this);
    this.slideTo = this.slideTo.bind(this);
    this.updateNewValues = this.updateNewValues.bind(this);
    this.setRef = this.setRef.bind(this);
    this.setHandleNode = this.setHandleNode.bind(this);
    this.setHandleContainerNode = this.setHandleContainerNode.bind(this);
    this.positionPercent = this.positionPercent.bind(this);
    this.invalidatePitStyleCache = this.invalidatePitStyleCache.bind(this);

    this.pitStyleCache = {};
  }

  componentDidMount() {
    // Note: This occurs in a timeout because styles need to be applied first
    this.handleDimensionsTimeout = setTimeout(() => {
      this.handleDimensionsTimeout = null;
      this.setState({ handleDimensions: this.getHandleDimensions() });
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    const {
      disabled,
      min,
      max,
      orientation,
      pitPoints,
      algorithm,
    } = this.props;

    const {
      values,
      slidingIndex,
    } = this.state;

    const minMaxChanged = nextProps.min !== min || nextProps.max !== max;

    const valuesChanged = (
      values.length !== nextProps.values.length
      || values.some((value, idx) => nextProps.values[idx] !== value)
    );

    const orientationChanged = nextProps.orientation !== orientation;

    const algorithmChanged = nextProps.algorithm !== algorithm;

    const pitPointsChanged = nextProps.pitPoints !== pitPoints;

    const willBeDisabled = nextProps.disabled && !disabled;

    if (minMaxChanged || valuesChanged) this.updateNewValues(nextProps);

    if (willBeDisabled && slidingIndex !== null) {
      this.endSlide();
    }

    if (minMaxChanged || pitPointsChanged || orientationChanged || algorithmChanged) {
      this.invalidatePitStyleCache();
    }
  }

  componentWillUnmount() {
    if (this.handleDimensionsTimeout) {
      clearTimeout(this.handleDimensionsTimeout);
      this.handleDimensionsTimeout = null;
    }
  }

  getPublicState() {
    const { values } = this.state;
    const {
      min,
      max,
    } = this.props;

    return {
      max,
      min,
      values,
    };
  }

  getSliderBoundingBox() {
    const rect = this.handleContainerNode.getBoundingClientRect();
    return {
      height: rect.height || this.handleContainerNode.clientHeight,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width || this.handleContainerNode.clientWidth,
    };
  }

  getProgressStyle(idx) {
    const { orientation } = this.props;
    const { handlePos } = this.state;

    const value = handlePos[idx];

    if (idx === 0) {
      return orientation === VERTICAL
        ? { height: `${value}%`, top: 0 }
        : { left: 0, width: `${value}%` };
    }

    const prevValue = handlePos[idx - 1];
    const diffValue = value - prevValue;

    return orientation === VERTICAL
      ? { height: `${diffValue}%`, top: `${prevValue}%` }
      : { left: `${prevValue}%`, width: `${diffValue}%` };
  }

  getMinValue(idx) {
    const { min } = this.props;
    const { values } = this.state;

    return values[idx - 1]
      ? Math.max(min, values[idx - 1])
      : min;
  }

  getMaxValue(idx) {
    const { max } = this.props;

    const { values } = this.state;

    return values[idx + 1]
      ? Math.min(max, values[idx + 1])
      : max;
  }

  getClosestSnapPoint(value) {
    const { snapPoints } = this.props;
    if (!snapPoints.length) return value;

    return snapPoints.reduce((snapTo, snap) => (
      Math.abs(snapTo - value) < Math.abs(snap - value) ? snapTo : snap
    ));
  }

  getHandleDimensions() {
    const { orientation } = this.props;
    if (!this.handleNode) return 0;

    return orientation === VERTICAL
      ? this.handleNode.clientHeight
      : this.handleNode.clientWidth;
  }

  getSnapPosition(positionPercent) {
    const {
      algorithm,
      max,
      min,
      snap,
    } = this.props;

    if (!snap) return positionPercent;
    const value = algorithm.getValue(positionPercent, min, max);
    const snapValue = this.getClosestSnapPoint(value);
    return algorithm.getPosition(snapValue, min, max);
  }

  getNextPositionForKey(idx, keyCode) {
    const { handlePos, values } = this.state;
    const {
      algorithm,
      max,
      min,
      snapPoints,
      snap: shouldSnap,
    } = this.props;

    let proposedValue = values[idx];
    let proposedPercentage = handlePos[idx];
    const originalPercentage = proposedPercentage;
    let stepValue = 1;

    if (max >= 100) {
      proposedPercentage = Math.round(proposedPercentage);
    } else {
      stepValue = 100 / (max - min);
    }

    let currentIndex = null;

    if (shouldSnap) {
      currentIndex = snapPoints.indexOf(this.getClosestSnapPoint(values[idx]));
    }

    const stepMultiplier = {
      [KEYS.LEFT]: v => v * -1,
      [KEYS.RIGHT]: v => v * 1,
      [KEYS.UP]: v => v * 1,
      [KEYS.DOWN]: v => v * -1,
      [KEYS.PAGE_DOWN]: v => (v > 1 ? -v : v * -10),
      [KEYS.PAGE_UP]: v => (v > 1 ? v : v * 10),
    };

    if (has.call(stepMultiplier, keyCode)) {
      proposedPercentage += stepMultiplier[keyCode](stepValue);

      if (shouldSnap) {
        if (proposedPercentage > originalPercentage) {
          // move cursor right unless overflow
          if (currentIndex < snapPoints.length - 1) {
            proposedValue = snapPoints[currentIndex + 1];
          }
        // move cursor left unless there is overflow
        } else if (currentIndex > 0) {
          proposedValue = snapPoints[currentIndex - 1];
        }
      }
    } else if (keyCode === KEYS.HOME) {
      proposedPercentage = PERCENT_EMPTY;

      if (shouldSnap) {
        ([proposedValue] = snapPoints);
      }
    } else if (keyCode === KEYS.END) {
      proposedPercentage = PERCENT_FULL;

      if (shouldSnap) {
        proposedValue = snapPoints[snapPoints.length - 1];
      }
    } else {
      return null;
    }

    return shouldSnap
      ? algorithm.getPosition(proposedValue, min, max)
      : proposedPercentage;
  }

  getNextState(idx, proposedPosition) {
    const { handlePos } = this.state;

    const { max, min, algorithm } = this.props;

    const actualPosition = this.validatePosition(idx, proposedPosition);

    const nextHandlePos = handlePos.map((pos, index) => (
      index === idx ? actualPosition : pos
    ));

    return {
      handlePos: nextHandlePos,
      values: nextHandlePos.map(pos => algorithm.getValue(pos, min, max)),
    };
  }

  getClosestHandle(positionPercent) {
    const { handlePos } = this.state;

    return handlePos.reduce((closestIdx, node, idx) => {
      const challenger = Math.abs(handlePos[idx] - positionPercent);
      const current = Math.abs(handlePos[closestIdx] - positionPercent);
      return challenger < current ? idx : closestIdx;
    }, 0);
  }

  setHandleNode(node) {
    this.handleNode = node;
  }

  setHandleContainerNode(node) {
    this.handleContainerNode = node;
  }

  setStartSlide(ev) {
    const sliderBox = this.getSliderBoundingBox();
    this.setState({
      handleDimensions: this.getHandleDimensions(ev, sliderBox),
      slidingIndex: getHandleFor(ev),
    });
  }

  setRef(ref) {
    this.rheostat = ref;
  }

  startMouseSlide(ev) {
    const { onSliderDragStart } = this.props;

    this.setStartSlide(ev, ev.clientX, ev.clientY);

    if (typeof document.addEventListener === 'function') {
      document.addEventListener('mousemove', this.handleMouseSlide, false);
      document.addEventListener('mouseup', this.endSlide, false);
    } else {
      document.attachEvent('onmousemove', this.handleMouseSlide);
      document.attachEvent('onmouseup', this.endSlide);
    }

    if (onSliderDragStart) onSliderDragStart();

    killEvent(ev);
  }

  startTouchSlide(ev) {
    const { onSliderDragStart } = this.props;

    if (ev.changedTouches.length > 1) return;

    const touch = ev.changedTouches[0];

    this.setStartSlide(ev, touch.clientX, touch.clientY);

    document.addEventListener('touchmove', this.handleTouchSlide, false);
    document.addEventListener('touchend', this.endSlide, false);

    if (onSliderDragStart) onSliderDragStart();

    killEvent(ev);
  }

  handleMouseSlide(ev) {
    const { slidingIndex } = this.state;

    if (slidingIndex === null) return;
    this.handleSlide(ev.clientX, ev.clientY);
    killEvent(ev);
  }

  handleTouchSlide(ev) {
    const { slidingIndex } = this.state;

    if (slidingIndex === null) return;

    if (ev.changedTouches.length > 1) {
      this.endSlide();
      return;
    }

    const touch = ev.changedTouches[0];

    this.handleSlide(touch.clientX, touch.clientY);
    killEvent(ev);
  }

  positionPercent(x, y, sliderBox) {
    const { orientation } = this.props;
    if (orientation === VERTICAL) {
      return ((y - sliderBox.top) / sliderBox.height) * PERCENT_FULL;
    }
    return ((x - sliderBox.left) / sliderBox.width) * PERCENT_FULL;
  }

  handleSlide(x, y) {
    const { onSliderDragMove } = this.props;
    const { slidingIndex: idx } = this.state;
    const sliderBox = this.getSliderBoundingBox();
    const positionPercent = this.positionPercent(x, y, sliderBox);

    this.slideTo(idx, positionPercent);

    if (this.canMove(idx, positionPercent)) {
      if (onSliderDragMove) onSliderDragMove();
    }
  }

  endSlide() {
    const {
      onSliderDragEnd,
      snap,
    } = this.props;

    const {
      slidingIndex,
      handlePos,
    } = this.state;

    this.setState({ slidingIndex: null });

    if (typeof document.removeEventListener === 'function') {
      document.removeEventListener('mouseup', this.endSlide, false);
      document.removeEventListener('touchend', this.endSlide, false);
      document.removeEventListener('touchmove', this.handleTouchSlide, false);
      document.removeEventListener('mousemove', this.handleMouseSlide, false);
    } else {
      document.detachEvent('onmousemove', this.handleMouseSlide);
      document.detachEvent('onmouseup', this.endSlide);
    }

    if (onSliderDragEnd) onSliderDragEnd();
    if (snap) {
      const positionPercent = this.getSnapPosition(handlePos[slidingIndex]);
      this.slideTo(slidingIndex, positionPercent, () => this.fireChangeEvent());
    } else {
      this.fireChangeEvent();
    }
  }

  handleClick(ev) {
    if (ev.target.getAttribute('data-handle-key')) {
      return;
    }

    const {
      onClick,
      orientation,
    } = this.props;

    // Calculate the position of the slider on the page so we can determine
    // the position where you click in relativity.
    const sliderBox = this.getSliderBoundingBox();

    const positionDecimal = orientation === VERTICAL
      ? (ev.clientY - sliderBox.top) / sliderBox.height
      : (ev.clientX - sliderBox.left) / sliderBox.width;

    const positionPercent = positionDecimal * PERCENT_FULL;

    const handleId = this.getClosestHandle(positionPercent);

    const validPositionPercent = this.getSnapPosition(positionPercent);

    // Move the handle there
    this.slideTo(handleId, validPositionPercent, () => this.fireChangeEvent());

    if (onClick) onClick();
  }

  handleKeydown(ev) {
    const { onKeyPress } = this.props;
    const idx = getHandleFor(ev);

    if (ev.keyCode === KEYS.ESC) {
      ev.currentTarget.blur();
      return;
    }

    const proposedPercentage = this.getNextPositionForKey(idx, ev.keyCode);

    if (proposedPercentage === null) return;

    if (this.canMove(idx, proposedPercentage)) {
      this.slideTo(idx, proposedPercentage, () => this.fireChangeEvent());
      if (onKeyPress) onKeyPress();
    }

    killEvent(ev);
  }

  // Apply user adjustments to position
  userAdjustPosition(idx, proposedPosition) {
    const { getNextHandlePosition } = this.props;
    let nextPosition = proposedPosition;
    if (getNextHandlePosition) {
      nextPosition = parseFloat(getNextHandlePosition(idx, proposedPosition));

      if (
        Number.isNaN(nextPosition)
        || nextPosition < PERCENT_EMPTY
        || nextPosition > PERCENT_FULL
      ) {
        throw new TypeError('getNextHandlePosition returned invalid position. Valid positions are floats between 0 and 100');
      }
    }

    return nextPosition;
  }

  // Make sure the proposed position respects the bounds and
  // does not collide with other handles too much.
  validatePosition(idx, proposedPosition) {
    const {
      handlePos,
      handleDimensions,
    } = this.state;

    const nextPosition = this.userAdjustPosition(idx, proposedPosition);

    const { orientation } = this.props;
    const sliderBox = this.getSliderBoundingBox();

    const handlePercentage = orientation === VERTICAL
      ? ((handleDimensions / sliderBox.height) * PERCENT_FULL) / 2
      : ((handleDimensions / sliderBox.width) * PERCENT_FULL) / 2;

    return Math.max(
      Math.min(
        nextPosition,
        handlePos[idx + 1] !== undefined
          ? handlePos[idx + 1] - handlePercentage
          : PERCENT_FULL, // 100% is the highest value
      ),
      handlePos[idx - 1] !== undefined
        ? handlePos[idx - 1] + handlePercentage
        : PERCENT_EMPTY, // 0% is the lowest value
    );
  }

  validateValues(proposedValues, props) {
    const { max, min } = props || this.props;

    return proposedValues.map((value, idx, values) => {
      const realValue = Math.max(Math.min(value, max), min);

      if (values.length && realValue < values[idx - 1]) {
        return values[idx - 1];
      }

      return realValue;
    });
  }

  // Can we move the slider to the given position?
  canMove(idx, proposedPosition) {
    const {
      handlePos,
      handleDimensions,
    } = this.state;
    const { orientation } = this.props;
    const sliderBox = this.getSliderBoundingBox();

    const handlePercentage = orientation === VERTICAL
      ? ((handleDimensions / sliderBox.height) * PERCENT_FULL) / 2
      : ((handleDimensions / sliderBox.width) * PERCENT_FULL) / 2;

    if (proposedPosition < PERCENT_EMPTY) return false;
    if (proposedPosition > PERCENT_FULL) return false;

    const nextHandlePosition = handlePos[idx + 1] !== undefined
      ? handlePos[idx + 1] - handlePercentage
      : Infinity;

    if (proposedPosition > nextHandlePosition) return false;

    const prevHandlePosition = handlePos[idx - 1] !== undefined
      ? handlePos[idx - 1] + handlePercentage
      : -Infinity;

    if (proposedPosition < prevHandlePosition) return false;

    return true;
  }

  fireChangeEvent() {
    const { onChange } = this.props;
    if (onChange) onChange(this.getPublicState());
  }

  slideTo(idx, proposedPosition, onAfterSet) {
    const { onValuesUpdated } = this.props;
    const nextState = this.getNextState(idx, proposedPosition);

    this.setState(nextState, () => {
      if (onValuesUpdated) onValuesUpdated(this.getPublicState());
      if (onAfterSet) onAfterSet();
    });
  }

  updateNewValues(nextProps) {
    const { slidingIndex } = this.state;

    // Don't update while the slider is sliding
    if (slidingIndex !== null) {
      return;
    }
    const { algorithm } = this.props;
    const { max, min, values } = nextProps;

    const nextValues = this.validateValues(values, nextProps);
    this.setState({
      handlePos: nextValues.map(value => algorithm.getPosition(value, min, max)),
      values: nextValues,
    });
  }

  invalidatePitStyleCache() {
    this.pitStyleCache = {};
  }

  render() {
    const {
      css,
      autoAdjustVerticalPosition,
      algorithm,
      children,
      disabled,
      handle: Handle,
      max,
      min,
      orientation,
      pitComponent: PitComponent,
      pitPoints,
      background: Background,
      progressBar: ProgressBar,
      styles,
    } = this.props;

    const {
      handlePos,
      values,
    } = this.state;

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        onClick={disabled ? undefined : this.handleClick}
        {...css(
          styles.rheostat,
          autoAdjustVerticalPosition && styles.autoAdjustVerticalPosition,
          orientation === VERTICAL && styles.rheostat__vertical,
        )}
      >
        {
          !!Background && (
            <Background
              orientation={orientation}
            />
          )
        }
        <div
          ref={this.setHandleContainerNode}
          {...css(
            styles.handleContainer,
          )}
        >
          {handlePos.map((pos, idx) => {
            const handleStyle = orientation === VERTICAL
              ? { top: `${pos}%`, position: 'absolute' }
              : { left: `${pos}%`, position: 'absolute' };

            return (
              <Handle
                aria-valuemax={this.getMaxValue(idx)}
                aria-valuemin={this.getMinValue(idx)}
                aria-valuenow={values[idx]}
                aria-disabled={disabled}
                data-handle-key={idx}
                key={idx /* eslint-disable-line react/no-array-index-key */}
                orientation={orientation}
                disabled={disabled}
                onClick={this.killEvent}
                onKeyDown={disabled ? undefined : this.handleKeydown}
                onMouseDown={disabled ? undefined : this.startMouseSlide}
                onTouchStart={disabled ? undefined : this.startTouchSlide}
                handleRef={this.setHandleNode}
                role="slider"
                style={handleStyle}
                tabIndex={0}
              />
            );
          })}
        </div>
        {!!ProgressBar && handlePos.map((node, idx, arr) => {
          if (idx === 0 && arr.length > 1) {
            return null;
          }
          return (
            <ProgressBar
              key={idx /* eslint-disable-line react/no-array-index-key */}
              style={this.getProgressStyle(idx)}
              disabled={disabled}
            />
          );
        })}
        {PitComponent && pitPoints.map((n) => {
          let pitStyle = this.pitStyleCache[n];

          if (!pitStyle) {
            const pos = algorithm.getPosition(n, min, max);
            pitStyle = orientation === 'vertical'
              ? { top: `${pos}%`, position: 'absolute' }
              : { left: `${pos}%`, position: 'absolute' };
            this.pitStyleCache[n] = pitStyle;
          }

          return (
            <PitComponent key={n} style={pitStyle}>
              {n}
            </PitComponent>
          );
        })}
        {children}
      </div>
    );
  }
}

Rheostat.propTypes = propTypes;
Rheostat.defaultProps = defaultProps;

export default withStyles(({ rheostat: { color, unit, responsive } }) => ({
  rheostat: {
    position: 'relative',
    overflow: 'visible',
  },

  autoAdjustVerticalPosition: {
    [responsive.largeAndAbove]: {
      top: 1.5 * unit,
    },
  },

  rheostat__vertical: {
    height: '100%',
  },

  handleContainer: {
    height: (2 * unit) - 1,
    top: -2,
    left: -2,
    bottom: 4,
    width: '100%',
    position: 'absolute',
  },

  rheostat_background: {
    backgroundColor: color.white,
    border: `1px solid ${color.grey}`,
    position: 'relative',
  },

  rheostat_background__horizontal: {
    height: (2 * unit) - 1,
    top: -2,
    left: -2,
    bottom: 4,
    width: '100%',
  },

  rheostat_background__vertical: {
    width: (2 * unit) - 1,
    top: 0,
    height: '100%',
  },
}))(Rheostat);
