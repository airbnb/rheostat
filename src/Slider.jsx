import PropTypes from 'prop-types';
import React from 'react';
import LinearScale from './algorithms/linear';
import DefaultHandle from './DefaultHandle';
import DefaultProgressBar from './DefaultProgressBar'

import { withStyles, withStylesPropTypes } from 'react-with-styles';

import OrientationPropType from './propTypes/OrientationPropType';

import {
  HORIZONTAL,
  VERTICAL,
  PERCENT_FULL,
  PERCENT_EMPTY,
  DEFAULT_STEP,
  KEYS,
} from './constants/SliderConstants';

const has = Object.prototype.hasOwnProperty;

const PropTypeArrOfNumber = PropTypes.arrayOf(PropTypes.number);
const PropTypeReactComponent = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

/* istanbul ignore next */
function getHandleFor(ev) {
  return Number(ev.currentTarget.getAttribute('data-handle-key'));
}

/* istanbul ignore next */
function killEvent(ev) {
  ev.stopPropagation();
  ev.preventDefault();
}

class Button extends React.Component {
  render() {
    return <button {...this.props} type="button" />;
  }
}

/* istanbul ignore next */
const propTypes = {
  ...withStylesPropTypes,

  // Automatically adds a top position for large when enabled
  autoAdjustVerticalPosition: PropTypes.bool,

  // the algorithm to use
  algorithm: PropTypes.shape({
    getValue: PropTypes.func,
    getPosition: PropTypes.func,
  }),

  // any children you pass in
  children: PropTypes.any,

  // class name prop
  className: PropTypes.string,

  // prevent the slider from moving when clicked
  disabled: PropTypes.bool,

  // a custom handle you can pass in
  handle: PropTypeReactComponent,

  // the maximum possible value
  max: PropTypes.number,

  // the minimum possible value
  min: PropTypes.number,

  // step value
  step: PropTypes.number,

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

  // the values
  values: PropTypeArrOfNumber,
};

/* istanbul ignore next */
const defaultProps = {
  autoAdjustVerticalPosition: true,
  className: '',
  algorithm: LinearScale,
  disabled: false,
  max: PERCENT_FULL,
  min: PERCENT_EMPTY,
  step: DEFAULT_STEP,
  orientation: HORIZONTAL,
  pitPoints: [],
  handle: DefaultHandle,
  progressBar: DefaultProgressBar,

  values: [
    PERCENT_EMPTY,
  ],
};

/* istanbul ignore next */
export class Rheostat extends React.Component {
  constructor(props) {
    super(props);

    const {
      max,
      min,
      values,
    } = this.props;
    this.state = {
      handlePos: values.map(value => this.props.algorithm.getPosition(value, min, max)),
      handleDimensions: 0,
      mousePos: null,
      slidingIndex: null,
      values,
    };

    this.getPublicState = this.getPublicState.bind(this);
    this.getSliderBoundingBox = this.getSliderBoundingBox.bind(this);
    this.getProgressStyle = this.getProgressStyle.bind(this);
    this.getMinValue = this.getMinValue.bind(this);
    this.getMaxValue = this.getMaxValue.bind(this);
    this.getHandleDimensions = this.getHandleDimensions.bind(this);
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
    this.setHandleNode = this.setHandleNode.bind(this);
    this.setHandleContainerNode = this.setHandleContainerNode.bind(this);
    this.positionPercent = this.positionPercent.bind(this);
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
      className,
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

    const minMaxChanged = (
      nextProps.min !== this.props.min || nextProps.max !== this.props.max
    );

    const valuesChanged = (
      this.state.values.length !== nextProps.values.length ||
      this.state.values.some((value, idx) => nextProps.values[idx] !== value)
    );

    const orientationChanged = (
      nextProps.className !== className ||
      nextProps.orientation !== orientation
    );

    const willBeDisabled = nextProps.disabled && !this.props.disabled;

    if (minMaxChanged || valuesChanged) this.updateNewValues(nextProps);

    if (willBeDisabled && this.state.slidingIndex !== null) {
      this.endSlide();
    }
  }

  componentWillUnmount() {
    if (this.handleDimensionsTimeout) {
      clearTimeout(this.handleDimensionsTimeout);
    }
  }

  getPublicState() {
    return {
      max: this.props.max,
      min: this.props.min,
      values: this.state.values,
    };
  }

  // istanbul ignore next
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
    const { handlePos } = this.state;

    const value = handlePos[idx];

    if (idx === 0) {
      return this.props.orientation === VERTICAL
        ? { height: `${value}%`, top: 0 }
        : { left: 0, width: `${value}%` };
    }

    const prevValue = handlePos[idx - 1];
    const diffValue = value - prevValue;

    return this.props.orientation === VERTICAL
      ? { height: `${diffValue}%`, top: `${prevValue}%` }
      : { left: `${prevValue}%`, width: `${diffValue}%` };
  }

  getMinValue(idx) {
    return this.state.values[idx - 1]
      ? Math.max(this.props.min, this.state.values[idx - 1])
      : this.props.min;
  }

  getMaxValue(idx) {
    return this.state.values[idx + 1]
      ? Math.min(this.props.max, this.state.values[idx + 1])
      : this.props.max;
  }

  // istanbul ignore next
  getHandleDimensions() {
    return this.props.orientation === VERTICAL
      ? this.handleNode.clientHeight
      : this.handleNode.clientWidth;
  }

  getSnapPosition(positionPercent) {
    const {
      algorithm, max, min, step,
    } = this.props;

    if (step === 1) {
      return positionPercent;
    }

    const value = algorithm.getValue(positionPercent, min, max);

    const stepAmount = Math.min(step, max - min);
    const snapValue = min + (Math.round((value - min) / stepAmount) * stepAmount);
    return algorithm.getPosition(snapValue, min, max);
  }

  getNextPositionForKey(idx, keyCode) {
    const { values } = this.state;
    const {
      algorithm, max, min, step,
    } = this.props;

    let proposedValue = values[idx];

    const stepMultiplier = {
      [KEYS.LEFT]: v => v * -1,
      [KEYS.RIGHT]: v => v * 1,
      [KEYS.PAGE_DOWN]: v => (v > 1 ? -v : v * -10),
      [KEYS.PAGE_UP]: v => (v > 1 ? v : v * 10),
    };

    if (has.call(stepMultiplier, keyCode)) {
      proposedValue += stepMultiplier[keyCode](step);
    } else if (keyCode === KEYS.HOME) {
      proposedValue = algorithm.getValue(PERCENT_EMPTY, min, max);
    } else if (keyCode === KEYS.END) {
      proposedValue = algorithm.getValue(PERCENT_FULL, min, max);
    } else {
      return null;
    }

    return algorithm.getPosition(proposedValue, min, max);
  }

  getNextState(idx, proposedPosition) {
    const { handlePos } = this.state;
    const { max, min } = this.props;

    const actualPosition = this.validatePosition(idx, proposedPosition);

    const nextHandlePos = handlePos.map((pos, index) => (
      index === idx ? actualPosition : pos
    ));


    return {
      handlePos: nextHandlePos,
      values: nextHandlePos.map(pos => (
        this.props.algorithm.getValue(pos, min, max)
      )),
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

  // istanbul ignore next
  setStartSlide(ev) {
    const sliderBox = this.getSliderBoundingBox();
    this.setState({
      handleDimensions: this.getHandleDimensions(ev, sliderBox),
      slidingIndex: getHandleFor(ev),
    });
  }

  // istanbul ignore next
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

  // istanbul ignore next
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

  // istanbul ignore next
  handleMouseSlide(ev) {
    if (this.state.slidingIndex === null) return;
    this.handleSlide(ev.clientX, ev.clientY);
    killEvent(ev);
  }

  // istanbul ignore next
  handleTouchSlide(ev) {
    if (this.state.slidingIndex === null) return;

    if (ev.changedTouches.length > 1) {
      this.endSlide();
      return;
    }

    const touch = ev.changedTouches[0];

    this.handleSlide(touch.clientX, touch.clientY);
    killEvent(ev);
  }

  positionPercent(x, y, sliderBox) {
    if (this.props.orientation === VERTICAL) {
      return ((y - sliderBox.top) / sliderBox.height) * PERCENT_FULL;
    }
    const percent = ((x - sliderBox.left) / sliderBox.width) * PERCENT_FULL;
    return percent;
  }

  // istanbul ignore next
  handleSlide(x, y) {
    const { onSliderDragMove } = this.props;
    const { slidingIndex: idx } = this.state;
    const sliderBox = this.getSliderBoundingBox();
    const positionPercent = this.positionPercent(x, y, sliderBox);

    this.slideTo(idx, this.getSnapPosition(positionPercent));

    if (this.canMove(idx, positionPercent)) {
      // update mouse positions
      this.setState({ x, y });
      if (onSliderDragMove) onSliderDragMove();
    }
  }

  // istanbul ignore next
  endSlide() {
    const { onSliderDragEnd } = this.props;
    const idx = this.state.slidingIndex;

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
    const positionPercent = this.getSnapPosition(this.state.handlePos[idx]);
    this.slideTo(idx, positionPercent, () => this.fireChangeEvent());
  }

  // istanbul ignore next
  handleClick(ev) {
    if (ev.target.getAttribute('data-handle-key')) {
      return;
    }

    const { onClick } = this.props;

    // Calculate the position of the slider on the page so we can determine
    // the position where you click in relativity.
    const sliderBox = this.getSliderBoundingBox();

    const positionDecimal = this.props.orientation === VERTICAL
      ? (ev.clientY - sliderBox.top) / sliderBox.height
      : (ev.clientX - sliderBox.left) / sliderBox.width;

    const positionPercent = positionDecimal * PERCENT_FULL;

    const handleId = this.getClosestHandle(positionPercent);

    const validPositionPercent = this.getSnapPosition(positionPercent);

    // Move the handle there
    this.slideTo(handleId, validPositionPercent, () => this.fireChangeEvent());

    if (onClick) onClick();
  }

  // istanbul ignore next
  handleKeydown(ev) {
    const { onKeyPress } = this.props;
    const idx = getHandleFor(ev);

    if (ev.keyCode === KEYS.ESC) {
      ev.currentTarget.blur();
      return;
    }

    const proposedPercentage = this.getNextPositionForKey(idx, ev.keyCode);

    if (proposedPercentage === null || isNaN(proposedPercentage)) return;

    if (this.canMove(idx, proposedPercentage)) {
      this.slideTo(idx, proposedPercentage, () => this.fireChangeEvent());
      if (onKeyPress) onKeyPress();
    }

    killEvent(ev);
  }

  // Make sure the proposed position respects the bounds and
  // does not collide with other handles too much.
  validatePosition(idx, proposedPosition) {
    const { handlePos, handleDimensions } = this.state;
    const sliderBox = this.getSliderBoundingBox();

    const handlePercentage = this.props.orientation === VERTICAL
      ? ((handleDimensions / sliderBox.height) * PERCENT_FULL) / 2
      : ((handleDimensions / sliderBox.width) * PERCENT_FULL) / 2;

    const a =  Math.max(
      Math.min(
        proposedPosition,
        handlePos[idx + 1] !== undefined
          ? handlePos[idx + 1] - handlePercentage
          : PERCENT_FULL, // 100% is the highest value
      ),
      handlePos[idx - 1] !== undefined
        ? handlePos[idx - 1] + handlePercentage
        : PERCENT_EMPTY, // 0% is the lowest value
    );

    return a;
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
    const { handlePos, handleDimensions } = this.state;
    const sliderBox = this.getSliderBoundingBox();

    const handlePercentage = this.props.orientation === VERTICAL
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

  // istanbul ignore next
  fireChangeEvent() {
    const { onChange } = this.props;
    if (onChange) onChange(this.getPublicState());
  }

  // istanbul ignore next
  slideTo(idx, proposedPosition, onAfterSet) {
    const { onValuesUpdated } = this.props;
    const nextState = this.getNextState(idx, proposedPosition);

    this.setState(nextState, () => {
      if (onValuesUpdated) onValuesUpdated(this.getPublicState());
      if (onAfterSet) onAfterSet();
    });
  }

  // istanbul ignore next
  updateNewValues(nextProps) {
    // Don't update while the slider is sliding
    if (this.state.slidingIndex !== null) {
      return;
    }

    const { max, min, values } = nextProps;

    const nextValues = this.validateValues(values, nextProps);
    this.setState({
      handlePos: nextValues.map(value => this.props.algorithm.getPosition(value, min, max)),
      values: nextValues,
    }, () => this.fireChangeEvent());
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
      progressBar: ProgressBar,
      styles,
    } = this.props;

    const {
      handleDimensions,
      values,
    } = this.state;

    const handleContainerStyle = orientation === VERTICAL
      ? { left: 0, bottom: handleDimensions / 2, top: handleDimensions / 2 }
      : { top: 0, left: handleDimensions / 2, right: handleDimensions / 2 };

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        onClick={!disabled && this.handleClick}
        {...css(
          styles.rheostat,
          autoAdjustVerticalPosition && styles.autoAdjustVerticalPosition,
          orientation === VERTICAL && styles.rheostat_vertical,
        )}
      >
        <div
          ref={this.setHandleContainerNode}
          {...css(
            styles.handleContainer,
            handleContainerStyle,
            styles.Rheostat_background,
            orientation === VERTICAL ? styles.Rheostat_background__vertical : styles.Rheostat_background__horizontal,
          )}
        >
          {this.state.handlePos.map((pos, idx) => {
            const handleStyle = orientation === VERTICAL
              ? { top: `${pos}%`, position: 'absolute' }
              : { left: `${pos}%`, position: 'absolute' };

            return (
              <Handle
                aria-valuemax={this.getMaxValue(idx)}
                aria-valuemin={this.getMinValue(idx)}
                aria-valuenow={this.state.values[idx]}
                aria-disabled={disabled}
                data-handle-key={idx}
                key={idx}
                orientation={orientation}
                disabled={disabled}
                onClick={this.killEvent}
                onKeyDown={!disabled && this.handleKeydown}
                onMouseDown={!disabled && this.startMouseSlide}
                onTouchStart={!disabled && this.startTouchSlide}
                handleRef={this.setHandleNode}
                role="slider"
                style={handleStyle}
                tabIndex={0}
              />
            );
          })}
        </div>
        {!!ProgressBar && this.state.handlePos.map((node, idx, arr) => {
          if (idx === 0 && arr.length > 1) {
            return null;
          }
          return (
            <ProgressBar
              key={idx}
              style={this.getProgressStyle(idx)}
              disabled={disabled}
            />
          );
        })}
        {PitComponent && <br/>}
        {PitComponent && pitPoints.map((n) => {
          const pos = algorithm.getPosition(n, min, max);
          const pitStyle = orientation === VERTICAL
            ? { top: `${pos}%`, position: 'absolute' }
            : { left: `${pos}%`, position: 'absolute' };

          return (
            <PitComponent key={n} style={pitStyle}>{n}</PitComponent>
          );
        })}
        {children}
      </div>
    );
  }
}
Rheostat.propTypes = propTypes;
Rheostat.defaultProps = defaultProps;

/* istanbul ignore next */
export default withStyles(({ unit, responsive }) => ({
  rheostat: {
    position: 'relative',
    overflow: 'visible',
  },

  autoAdjustVerticalPosition: {
    [responsive.largeAndAbove]: {
      top: 1.5 * unit,
    },
  },

  rheostat_vertical: {
    height: '100%',
  },

  handleContainer: {
    position: 'absolute',
    top: '50%',
  },

  Rheostat_background: {
    backgroundColor: '#fcfcfc',
    border: '1px solid #d8d8d8',
    position: 'relative',
  },

  Rheostat_background__horizontal: {
    height: 15,
    top: -2,
    left: -2,
    bottom: 4,
    width: '100%',
  },

  Rheostat_background__vertical: {
    width: 15,
    top: 0,
    height: '100%',
  },
}))(Rheostat);
