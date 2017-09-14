/* globals document */
/* eslint react/no-array-index-key: 1 */

import React from 'react';
import PropTypes from 'prop-types';

import * as SliderConstants from './constants/SliderConstants';
import linear from './algorithms/linear';

function getClassName(props) {
  const orientation = props.orientation === 'vertical'
    ? 'rheostat-vertical'
    : 'rheostat-horizontal';

  return ['rheostat', orientation].concat(props.className.split(' ')).join(' ');
}

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

class Button extends React.Component {
  render() {
    return <button {...this.props} type="button" />;
  }
}

const propTypes = {
  // the algorithm to use
  algorithm: PropTypes.shape({
    getValue: PropTypes.func,
    getPosition: PropTypes.func,
  }),
  // any children you pass in
  children: PropTypes.node,
  // standard class name you'd like to apply to the root element
  className: PropTypes.string,
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
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
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
  // the values
  values: PropTypeArrOfNumber,
};

const defaultProps = {
  algorithm: linear,
  className: '',
  children: null,
  disabled: false,
  handle: Button,
  max: SliderConstants.PERCENT_FULL,
  min: SliderConstants.PERCENT_EMPTY,
  onClick: null,
  onChange: null,
  onKeyPress: null,
  onSliderDragEnd: null,
  onSliderDragMove: null,
  onSliderDragStart: null,
  onValuesUpdated: null,
  orientation: 'horizontal',
  pitComponent: null,
  pitPoints: [],
  progressBar: 'div',
  snap: false,
  snapPoints: [],
  values: [
    SliderConstants.PERCENT_EMPTY,
  ],
};

class Rheostat extends React.Component {
  constructor(props) {
    super(props);

    const { algorithm, max, min, values } = this.props;
    this.state = {
      className: getClassName(this.props),
      handlePos: values.map(value => algorithm.getPosition(value, min, max)),
      handleDimensions: 0,
      mousePos: null,
      sliderBox: {},
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
  }

  componentWillReceiveProps(nextProps) {
    const { className, disabled, min, max, orientation } = this.props;
    const { values, slidingIndex } = this.state;

    const minMaxChanged = (nextProps.min !== min || nextProps.max !== max);

    const valuesChanged = (
      values.length !== nextProps.values.length ||
      values.some((value, idx) => nextProps.values[idx] !== value)
    );

    const orientationChanged = (
      nextProps.className !== className ||
      nextProps.orientation !== orientation
    );

    const willBeDisabled = nextProps.disabled && !disabled;

    if (orientationChanged) {
      this.setState({
        className: getClassName(nextProps),
      });
    }

    if (minMaxChanged || valuesChanged) this.updateNewValues(nextProps);

    if (willBeDisabled && slidingIndex !== null) {
      this.endSlide();
    }
  }

  getPublicState() {
    const { min, max } = this.props;
    const { values } = this.state;

    return { max, min, values };
  }

  // istanbul ignore next
  getSliderBoundingBox() {
    const { rheostat } = this.refs;
    const node = rheostat.getDOMNode ? rheostat.getDOMNode() : rheostat;
    const rect = node.getBoundingClientRect();

    return {
      height: rect.height || node.clientHeight,
      left: rect.left,
      top: rect.top,
      width: rect.width || node.clientWidth,
    };
  }

  getProgressStyle(idx) {
    const { handlePos } = this.state;

    const value = handlePos[idx];

    if (idx === 0) {
      return this.props.orientation === 'vertical'
        ? { height: `${value}%`, top: 0 }
        : { left: 0, width: `${value}%` };
    }

    const prevValue = handlePos[idx - 1];
    const diffValue = value - prevValue;

    return this.props.orientation === 'vertical'
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
  getHandleDimensions(ev, sliderBox) {
    const handleNode = ev.currentTarget || null;

    if (!handleNode) return 0;

    return this.props.orientation === 'vertical'
      ? ((handleNode.clientHeight / sliderBox.height) * SliderConstants.PERCENT_FULL) / 2
      : ((handleNode.clientWidth / sliderBox.width) * SliderConstants.PERCENT_FULL) / 2;
  }

  getClosestSnapPoint(value) {
    if (!this.props.snapPoints.length) return value;

    return this.props.snapPoints.reduce((snapTo, snap) => (
      Math.abs(snapTo - value) < Math.abs(snap - value) ? snapTo : snap
    ));
  }

  getSnapPosition(positionPercent) {
    if (!this.props.snap) return positionPercent;

    const { algorithm, max, min } = this.props;

    const value = algorithm.getValue(positionPercent, min, max);

    const snapValue = this.getClosestSnapPoint(value);

    return algorithm.getPosition(snapValue, min, max);
  }

  getNextPositionForKey(idx, keyCode) {
    const { handlePos, values } = this.state;
    const { algorithm, max, min, snapPoints } = this.props;

    const shouldSnap = this.props.snap;

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
      [SliderConstants.KEYS.LEFT]: v => v * -1,
      [SliderConstants.KEYS.RIGHT]: v => v * 1,
      [SliderConstants.KEYS.UP]: v => v * 1,
      [SliderConstants.KEYS.DOWN]: v => v * -1,
      [SliderConstants.KEYS.PAGE_DOWN]: v => (v > 1 ? -v : v * -10),
      [SliderConstants.KEYS.PAGE_UP]: v => (v > 1 ? v : v * 10),
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
    } else if (keyCode === SliderConstants.KEYS.HOME) {
      proposedPercentage = SliderConstants.PERCENT_EMPTY;

      if (shouldSnap) {
        proposedValue = snapPoints[0];
      }
    } else if (keyCode === SliderConstants.KEYS.END) {
      proposedPercentage = SliderConstants.PERCENT_FULL;

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

  // istanbul ignore next
  setStartSlide(ev, x, y) {
    const sliderBox = this.getSliderBoundingBox();

    this.setState({
      handleDimensions: this.getHandleDimensions(ev, sliderBox),
      mousePos: { x, y },
      sliderBox,
      slidingIndex: getHandleFor(ev),
    });
  }

  // istanbul ignore next
  startMouseSlide(ev) {
    this.setStartSlide(ev, ev.clientX, ev.clientY);

    if (typeof document.addEventListener === 'function') {
      document.addEventListener('mousemove', this.handleMouseSlide, false);
      document.addEventListener('mouseup', this.endSlide, false);
    } else {
      document.attachEvent('onmousemove', this.handleMouseSlide);
      document.attachEvent('onmouseup', this.endSlide);
    }

    killEvent(ev);
  }

  // istanbul ignore next
  startTouchSlide(ev) {
    if (ev.changedTouches.length > 1) return;

    const touch = ev.changedTouches[0];

    this.setStartSlide(ev, touch.clientX, touch.clientY);

    document.addEventListener('touchmove', this.handleTouchSlide, false);
    document.addEventListener('touchend', this.endSlide, false);

    if (this.props.onSliderDragStart) this.props.onSliderDragStart();

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

  // istanbul ignore next
  handleSlide(x, y) {
    const { slidingIndex: idx, sliderBox } = this.state;

    const positionPercent = this.props.orientation === 'vertical'
      ? ((y - sliderBox.top) / sliderBox.height) * SliderConstants.PERCENT_FULL
      : ((x - sliderBox.left) / sliderBox.width) * SliderConstants.PERCENT_FULL;

    this.slideTo(idx, positionPercent);

    if (this.canMove(idx, positionPercent)) {
      // update mouse positions
      this.setState({ x, y });
      if (this.props.onSliderDragMove) this.props.onSliderDragMove();
    }
  }

  // istanbul ignore next
  endSlide() {
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

    if (this.props.onSliderDragEnd) this.props.onSliderDragEnd();
    if (this.props.snap) {
      const positionPercent = this.getSnapPosition(this.state.handlePos[idx]);
      this.slideTo(idx, positionPercent, () => this.fireChangeEvent());
    } else {
      this.fireChangeEvent();
    }
  }

  // istanbul ignore next
  handleClick(ev) {
    if (ev.target.getAttribute('data-handle-key')) {
      return;
    }

    // Calculate the position of the slider on the page so we can determine
    // the position where you click in relativity.
    const sliderBox = this.getSliderBoundingBox();

    const positionDecimal = this.props.orientation === 'vertical'
      ? (ev.clientY - sliderBox.top) / sliderBox.height
      : (ev.clientX - sliderBox.left) / sliderBox.width;

    const positionPercent = positionDecimal * SliderConstants.PERCENT_FULL;

    const handleId = this.getClosestHandle(positionPercent);

    const validPositionPercent = this.getSnapPosition(positionPercent);

    // Move the handle there
    this.slideTo(handleId, validPositionPercent, () => this.fireChangeEvent());

    if (this.props.onClick) this.props.onClick();
  }

  // istanbul ignore next
  handleKeydown(ev) {
    const idx = getHandleFor(ev);

    if (ev.keyCode === SliderConstants.KEYS.ESC) {
      ev.currentTarget.blur();
      return;
    }

    const proposedPercentage = this.getNextPositionForKey(idx, ev.keyCode);

    if (proposedPercentage === null) return;

    if (this.canMove(idx, proposedPercentage)) {
      this.slideTo(idx, proposedPercentage, () => this.fireChangeEvent());
      if (this.props.onKeyPress) this.props.onKeyPress();
    }

    killEvent(ev);
  }

  // Make sure the proposed position respects the bounds and
  // does not collide with other handles too much.
  validatePosition(idx, proposedPosition) {
    const { handlePos, handleDimensions } = this.state;

    return Math.max(
      Math.min(
        proposedPosition,
        handlePos[idx + 1] !== undefined
          ? handlePos[idx + 1] - handleDimensions
          : SliderConstants.PERCENT_FULL, // 100% is the highest value
      ),
      handlePos[idx - 1] !== undefined
        ? handlePos[idx - 1] + handleDimensions
        : SliderConstants.PERCENT_EMPTY, // 0% is the lowest value
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
    const { handlePos, handleDimensions } = this.state;

    if (proposedPosition < SliderConstants.PERCENT_EMPTY) return false;
    if (proposedPosition > SliderConstants.PERCENT_FULL) return false;

    const nextHandlePosition = handlePos[idx + 1] !== undefined
      ? handlePos[idx + 1] - handleDimensions
      : Infinity;

    if (proposedPosition > nextHandlePosition) return false;

    const prevHandlePosition = handlePos[idx - 1] !== undefined
      ? handlePos[idx - 1] + handleDimensions
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
    const nextState = this.getNextState(idx, proposedPosition);

    this.setState(nextState, () => {
      const { onValuesUpdated } = this.props;
      if (onValuesUpdated) onValuesUpdated(this.getPublicState());
      if (onAfterSet) onAfterSet();
    });
  }

  // istanbul ignore next
  updateNewValues(nextProps) {
    const { slidingIndex } = this.state;

    // Don't update while the slider is sliding
    if (slidingIndex !== null) {
      return;
    }

    const { max, min, values } = nextProps;
    const { algorithm } = this.props;

    const nextValues = this.validateValues(values, nextProps);

    this.setState({
      handlePos: nextValues.map(value => algorithm.getPosition(value, min, max)),
      values: nextValues,
    }, () => this.fireChangeEvent());
  }

  render() {
    const {
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
    } = this.props;
    const { className, handlePos, values } = this.state;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={className}
        ref="rheostat"
        onClick={!disabled && this.handleClick}
        style={{ position: 'relative' }}
      >
        <div className="rheostat-background" />
        {handlePos.map((pos, idx) => {
          const handleStyle = orientation === 'vertical'
            ? { top: `${pos}%`, position: 'absolute' }
            : { left: `${pos}%`, position: 'absolute' };

          return (
            <Handle
              aria-valuemax={this.getMaxValue(idx)}
              aria-valuemin={this.getMinValue(idx)}
              aria-valuenow={values[idx]}
              aria-disabled={disabled}
              data-handle-key={idx}
              className="rheostat-handle"
              key={`handle-${idx}`}
              onClick={this.killEvent}
              onKeyDown={!disabled && this.handleKeydown}
              onMouseDown={!disabled && this.startMouseSlide}
              onTouchStart={!disabled && this.startTouchSlide}
              role="slider"
              style={handleStyle}
              tabIndex={0}
            />
          );
        })}
        {handlePos.map((node, idx, arr) => {
          if (idx === 0 && arr.length > 1) {
            return null;
          }

          return (
            <ProgressBar
              className="rheostat-progress"
              key={`progress-bar-${idx}`}
              style={this.getProgressStyle(idx)}
            />
          );
        })}
        {PitComponent && pitPoints.map((n) => {
          const pos = algorithm.getPosition(n, min, max);
          const pitStyle = orientation === 'vertical'
            ? { top: `${pos}%`, position: 'absolute' }
            : { left: `${pos}%`, position: 'absolute' };

          return (
            <PitComponent key={`pit-${n}`} style={pitStyle}>{n}</PitComponent>
          );
        })}
        {children}
      </div>
    );
  }
}
Rheostat.propTypes = propTypes;
Rheostat.defaultProps = defaultProps;

export default Rheostat;
