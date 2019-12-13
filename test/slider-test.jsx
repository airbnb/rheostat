import { shallow, mount } from 'enzyme';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import sinon from 'sinon';
import { assert } from 'chai';
import has from 'has';
import DirectionProvider, { DIRECTIONS } from 'react-with-direction/dist/DirectionProvider';
import Slider from '../src/Slider';
import DefaultHandle from '../src/DefaultHandle';
import DefaultProgressBar from '../src/DefaultProgressBar';

import {
  KEYS,
  VERTICAL,
} from '../src/constants/SliderConstants';

const { WITH_DOM } = process.env;

const describeWithDOM = WITH_DOM === '1' ? describe : describe.skip;
function testKeys(slider, tests) {
  Object.keys(tests).forEach((key) => {
    const keyCode = KEYS[key];
    const pos = tests[key];
    assert(slider.getNextPositionForKey(0, keyCode) === pos, `${key}: ${pos}%`);
  });
}

describeWithDOM('<Slider />', () => {
  describe('render', () => {
    it('should render the slider with one handle by default', () => {
      const wrapper = shallow(<Slider />).dive().dive();
      assert(wrapper.find(DefaultHandle).length === 1, 'no values one handle');
    });

    it('should render the slider with a single handle', () => {
      const wrapper = shallow(<Slider values={[1]} handle={DefaultHandle} />).dive().dive();
      assert(wrapper.find(DefaultHandle).length === 1, 'one handle is present');
    });

    it('should render the slider with as many handles as values', () => {
      const wrapper = shallow(<Slider values={[0, 25, 50, 75, 100]} />).dive().dive();
      assert(wrapper.find(DefaultHandle).length === 5, 'five handles are present');
    });

    it('should render the slider with a bar', () => {
      const wrapper = shallow(<Slider />).dive().dive();
      assert(wrapper.find(DefaultProgressBar).length === 1, 'the bar is present');
    });

    it('renders pits if they are provided', () => {
      const pitRender = sinon.stub().returns(<div />);
      const PitComponent = createReactClass({
        render: pitRender,
      });

      mount(<Slider pitComponent={PitComponent} pitPoints={[0, 20]} />);

      assert.isTrue(pitRender.calledTwice, 'two pits were rendered, one for each point');
    });

    it('renders pits if they are provided', () => {
      const pitRender = sinon.stub().returns(<div />);
      const PitComponent = createReactClass({
        render: pitRender,
      });

      mount((
        <Slider
          orientation="vertical"
          pitComponent={PitComponent}
          pitPoints={[10]}
        />
      ));

      assert.isTrue(pitRender.calledOnce, 'one pit was rendered vertically');
    });

    it('doesn\'t re-renders pits when value are changed', () => {
      const pitRender = sinon.stub().returns(<div />);
      const PitComponent = createReactClass({
        mixins: [PureRenderMixin],
        render: pitRender,
      });

      mount(<Slider
        pitComponent={PitComponent}
        pitPoints={[20]}
        values={[10]}
      />);

      assert.isTrue(pitRender.calledOnce, 'one pit was rendered only once');
    });

    it('should not throw react errors on disabled', () => {
      const slider = mount(<Slider />);
      slider.setProps({ disabled: true });
    });

    it('should pass undefined to key and mouse event handlers on disabled', () => {
      const slider = mount(<Slider disabled />);
      assert.isUndefined(slider.find(DefaultHandle).first().props().onKeyDown, 'onKeyDown is undefined');
      assert.isUndefined(slider.find(DefaultHandle).first().props().onMouseDown, 'onMouseDown is undefined');
      assert.isUndefined(slider.find(DefaultHandle).first().props().onTouchStart, 'onTouchStart is undefined');
    });

    it('should pass functions to key and mouse event handlers', () => {
      const slider = mount(<Slider />);
      assert.isFunction(slider.find(DefaultHandle).first().props().onKeyDown, 'onKeyDown is function');
      assert.isFunction(slider.find(DefaultHandle).first().props().onMouseDown, 'onMouseDown is function');
      assert.isFunction(slider.find(DefaultHandle).first().props().onTouchStart, 'onTouchStart is function');
    });
  });

  describe('componentWillReceiveProps', () => {
    it('should not call onChange twice if values are the same as what is in state', () => {
      const onChange = sinon.spy();
      const slider = shallow(<Slider onChange={onChange} values={[0]} />).dive().dive();

      // programatically change values like if the slider was dragged
      slider.setState({ values: [10] });

      slider.setProps({ values: [10] });

      assert(onChange.callCount === 0, 'onChange was not called');
    });

    it('should not update values if we are sliding', () => {
      const onChange = sinon.spy();
      const slider = shallow(<Slider onChange={onChange} values={[0]} />).dive().dive();

      slider.setState({ slidingIndex: 0 });

      slider.setProps({ values: [50] });

      assert(onChange.callCount === 0, 'updateNewValues was not called');
    });

    it('should not update values if they are the same', () => {
      const onChange = sinon.spy();
      const slider = mount(<Slider onChange={onChange} values={[50]} />);

      slider.setProps({ values: [50] });

      assert(onChange.callCount === 0, 'updateNewValues was not called');
    });

    it('should update values when they change', () => {
      const slider = shallow(<Slider values={[50]} />).dive().dive();

      slider.setProps({ values: [80] });

      assert.include(slider.state('values'), 80, 'new value is reflected in state');
    });

    it('should re-render pits when min or max are changed', () => {
      const pitRender = sinon.stub().returns(<div />);
      const PitComponent = createReactClass({
        mixins: [PureRenderMixin],
        render: pitRender,
      });

      const slider = mount(<Slider pitComponent={PitComponent} pitPoints={[20]} />);
      slider.setProps({ min: 30 });
      slider.setProps({ max: 60 });

      assert.isTrue(pitRender.calledThrice, 'one pit was rendered thrice');
    });

    it('should re-render pits when pitPoints are changed', () => {
      const pitRender = sinon.stub().returns(<div />);
      const PitComponent = createReactClass({
        mixins: [PureRenderMixin],
        render: pitRender,
      });

      const slider = mount(<Slider pitComponent={PitComponent} pitPoints={[20]} />);
      slider.setProps({ pitPoints: [40] });

      assert.isTrue(pitRender.calledTwice, 'one pit was rendered twice');
    });

    it('should re-render pits when orientation are changed', () => {
      const pitRender = sinon.stub().returns(<div />);
      const PitComponent = createReactClass({
        mixins: [PureRenderMixin],
        render: pitRender,
      });

      const slider = mount(<Slider pitComponent={PitComponent} pitPoints={[20]} />);
      slider.setProps({ orientation: VERTICAL });

      assert.isTrue(pitRender.calledTwice, 'one pit was rendered twice');
    });

    it('should re-render pits when algorithm are changed', () => {
      const pitRender = sinon.stub().returns(<div />);
      const PitComponent = createReactClass({
        mixins: [PureRenderMixin],
        render: pitRender,
      });

      const algorithm = {
        getPosition: () => 20,
        getValue: () => 30,
      };

      const slider = mount(<Slider pitComponent={PitComponent} pitPoints={[20]} />);
      slider.setProps({ algorithm });

      assert.isTrue(pitRender.calledTwice, 'one pit was rendered twice');
    });

    it('should move the values if the min is changed to be larger', () => {
      const slider = shallow(<Slider values={[50]} />).dive().dive();
      slider.setProps({ min: 80 });

      assert.include(slider.state('values'), 80, 'values was updated');
    });

    it('should move the values if the max is changed to be smaller', () => {
      const slider = shallow(<Slider values={[50]} />).dive().dive();
      slider.setProps({ max: 20 });

      assert.include(slider.state('values'), 20, 'values was updated');
    });

    it('should add handles', () => {
      const slider = shallow(<Slider />).dive().dive();
      assert(slider.state('values').length === 1, 'one handle exists');
      assert(slider.state('handlePos').length === 1, 'one handle exists');

      slider.setProps({ values: [] });
      assert(slider.state('values').length === 0, 'no handles exist');
      assert(slider.state('handlePos').length === 0, 'no handles exist');

      slider.setProps({ values: [0, 100] });
      assert(slider.state('values').length === 2, 'two handles exist');
      assert(slider.state('handlePos').length === 2, 'two handles exist');
    });
  });

  describe('getSliderBoundingBox', () => {
    it('returns null if the ref to the handle container node is not yet set', () => {
      const slider = shallow(<Slider />).dive().dive().instance();
      assert.isNull(slider.getSliderBoundingBox(), 'handle container ref is not yet set');
    });
  });
});

describe('Slider API', () => {
  describe('getPublicState', () => {
    it('should only return min, max, and values from public state', () => {
      const slider = shallow(<Slider />).dive().dive().instance();

      const state = slider.getPublicState();

      assert.isTrue(has(state, 'max'), 'max exists');
      assert.isTrue(has(state, 'min'), 'min exists');
      assert.isTrue(has(state, 'values'), 'values exists');
      assert(Object.keys(state).length === 3, 'only 3 properties are present');
    });
  });

  describe('getProgressStyle', () => {
    it('should get correct style for horizontal slider', () => {
      const slider = shallow(<Slider />).dive().dive().instance();
      const style = slider.getProgressStyle(0);

      assert.isTrue(has(style, 'left'), 'left exists');
      assert.isTrue(has(style, 'width'), 'width exists');
      assert(Object.keys(style).length === 2, 'only two properties exist');
    });

    it('should get correct style for single handle at 0%', () => {
      const slider = shallow(<Slider />).dive().dive().instance();
      const style = slider.getProgressStyle(0);

      assert(style.left === 0, 'progress bar is at 0 because it is single handle');

      assert(style.width === '0%', 'progress bar is at 0%');
    });

    it('should get correct style for single handle at 50%', () => {
      const slider = shallow(<Slider values={[50]} max={100} />).dive().dive().instance();

      const style = slider.getProgressStyle(0);

      assert(style.width === '50%', 'progress bar is at 50');
    });

    it('should get correct style for second handle at 50%', () => {
      const slider = shallow(<Slider values={[50, 100]} max={100} />).dive().dive().instance();
      const style = slider.getProgressStyle(1);

      assert(style.left === '50%', 'progress bar starts at 50%');
      assert(style.width === '50%', 'progress bar spans 50%');
    });

    it('should get correct style for vertical slider', () => {
      const slider = shallow(<Slider orientation={VERTICAL} />).dive().dive().instance();
      const style = slider.getProgressStyle(0);

      assert.isTrue(has(style, 'top'), 'top exists');
      assert.isTrue(has(style, 'height'), 'height exists');
      assert(Object.keys(style).length === 2, 'only two properties exist');
    });

    it('should get correct style for second handle and vertical slider', () => {
      const slider = shallow(<Slider
        values={[50, 100]}
        orientation={VERTICAL}
      />).dive().dive().instance();

      const style = slider.getProgressStyle(1);

      assert(style.top === '50%', 'progress bar starts at 50%');
      assert(style.height === '50%', 'progress bar spans 50%');
    });
  });

  describe('getMinValue', () => {
    it('should get the min value for single handle', () => {
      const slider = shallow(<Slider values={[20]} min={10} />).dive().dive().instance();
      assert(slider.getMinValue(0) === 10, 'the minimum possible value is 10');
    });

    it('should get the min value for second handle', () => {
      const slider = shallow(<Slider values={[20, 40]} min={0} />).dive().dive().instance();
      assert(slider.getMinValue(1) === 20, 'the minimum possible value is 20');
    });
  });

  describe('getMaxValue', () => {
    it('should get the max value for single handle', () => {
      const slider = shallow(<Slider values={[20]} max={50} />).dive().dive().instance();
      assert(slider.getMaxValue(0) === 50, 'the maximum possible value is 50');
    });

    it('should get the max value for two handles', () => {
      const slider = shallow(<Slider values={[20, 30]} />).dive().dive().instance();
      assert(slider.getMaxValue(0) === 30, 'the maximum possible value is 30');
    });
  });

  describe('getClosestSnapPoint', () => {
    it('should get the closest value inside points given a value', () => {
      const slider = shallow(<Slider snapPoints={[0, 50]} />).dive().dive().instance();
      assert(slider.getClosestSnapPoint(25) === 50, 'the closest point is 50');
      assert(slider.getClosestSnapPoint(24) === 0, 'the closest point is 0');
    });

    it('should return the value if points does not exist', () => {
      const slider = shallow(<Slider />).dive().dive().instance();
      assert(slider.getClosestSnapPoint(42) === 42, 'the closest point is 42');
    });
  });

  describe('getSnapPosition', () => {
    it('should return the position if snap is false', () => {
      const slider = shallow(<Slider />).dive().dive().instance();
      assert(slider.getSnapPosition(20) === 20, 'position is 20');
    });

    it('should snap to the closest value and give its position', () => {
      const slider = shallow(<Slider
        snap
        snapPoints={[0, 25, 50, 75, 100]}
      />).dive().dive().instance();

      assert(slider.getSnapPosition(20) === 25, 'position is at 25%');
      assert(slider.getSnapPosition(96) === 100, 'position is at 100%');
      assert(slider.getSnapPosition(55) === 50, 'position is at 50%');
    });
  });

  describe('getNextPositionForKey', () => {
    it('should try to advance 1% when pressing left, right, up or down', () => {
      const slider = shallow(<Slider values={[50]} />).dive().dive().instance();

      testKeys(slider, {
        LEFT: 49,
        RIGHT: 51,
        UP: 51,
        DOWN: 49,
      });
    });

    it('should try to advance up to 10% when pressing page up/down', () => {
      const slider = shallow(<Slider values={[50]} />).dive().dive().instance();

      testKeys(slider, {
        PAGE_UP: 60,
        PAGE_DOWN: 40,
      });
    });

    it('should reach the start/end when pressing home/end', () => {
      const slider = shallow(<Slider values={[50]} />).dive().dive().instance();

      testKeys(slider, {
        HOME: 0,
        END: 100,
      });
    });

    it('overflows min', () => {
      const slider = shallow(<Slider values={[0]} />).dive().dive().instance();

      testKeys(slider, {
        PAGE_DOWN: -10,
        LEFT: -1,
        HOME: 0,
      });
    });

    it('overflows max', () => {
      const slider = shallow(<Slider values={[100]} />).dive().dive().instance();

      testKeys(slider, {
        END: 100,
        RIGHT: 101,
        PAGE_UP: 110,
      });
    });

    it('should increment by value on a really small scale', () => {
      const slider = shallow(<Slider values={[2]} max={5} />).dive().dive().instance();

      testKeys(slider, {
        END: 100,
        RIGHT: 60,
        PAGE_UP: 60,
        PAGE_DOWN: 20,
        LEFT: 20,
        HOME: 0,
      });
    });

    it('should handle large scales well', () => {
      const slider = shallow(<Slider values={[5e8]} max={1e9} />).dive().dive().instance();

      testKeys(slider, {
        END: 100,
        RIGHT: 51,
        PAGE_UP: 60,
        PAGE_DOWN: 40,
        LEFT: 49,
        HOME: 0,
      });
    });

    it('should snap to a value if snap is set', () => {
      const slider = shallow(<Slider
        snap
        snapPoints={[10, 20, 40, 60, 80]}
        values={[40]}
      />).dive().dive().instance();

      testKeys(slider, {
        END: 80,
        RIGHT: 60,
        PAGE_UP: 60,
        PAGE_DOWN: 20,
        LEFT: 20,
        HOME: 10,
      });
    });

    it('should not overflow min with snap', () => {
      const slider = shallow(<Slider
        snap
        snapPoints={[10, 20, 40, 60, 80]}
        values={[10]}
      />).dive().dive().instance();

      testKeys(slider, {
        LEFT: 10,
        PAGE_DOWN: 10,
        HOME: 10,
      });
    });

    it('should not overflow max with snap', () => {
      const slider = shallow(<Slider
        snap
        snapPoints={[10, 20, 40, 60, 80]}
        values={[80]}
      />).dive().dive().instance();


      testKeys(slider, {
        RIGHT: 80,
        PAGE_UP: 80,
        END: 80,
      });
    });

    it('should return null for escape', () => {
      const slider = shallow(<Slider />).dive().dive().instance();
      assert.isNull(slider.getNextPositionForKey(0, KEYS.ESC));
    });
  });

  describe('need slider bounding box defined', () => {
    const sliderBoundingBox = {
      height: 15,
      left: 145,
      right: 423,
      top: 53.59375,
      width: 278,
    };

    describe('getNextState', () => {
      it('should return the next state given a position and index', () => {
        const slider = shallow(<Slider values={[0]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);
        const nextState = slider.getNextState(0, 50);
        assert(nextState.handlePos[0] === 50, 'handle is at 50%');
        assert(nextState.values[0] === 50, 'the value is 50');
      });

      it('should return correct validated state given two handles and overflow', () => {
        const slider = shallow(<Slider values={[0, 20]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);
        const nextState = slider.getNextState(0, 50);
        assert(nextState.handlePos[0] === 20, 'handle is at 20%');
        assert(nextState.values[0] === 20, 'the value is 20');
      });

      it('should not overflow the boundaries', () => {
        const slider = shallow(<Slider values={[20]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        let nextState = slider.getNextState(0, -20);

        assert(nextState.handlePos[0] === 0, 'handle is at 0%');
        assert(nextState.values[0] === 0, 'the value is 0');

        nextState = slider.getNextState(0, 120);

        assert(nextState.handlePos[0] === 100, 'handle is at 100%');
        assert(nextState.values[0] === 100, 'the value is 100');
      });
    });

    describe('validatePosition', () => {
      it('should make sure that handles respect bounds', () => {
        const slider = shallow(<Slider values={[50]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert(slider.validatePosition(0, -20) === 0, 'the handle was set to the min');
        assert(slider.validatePosition(0, 120) === 100, 'the handle was set to the max');
        assert(slider.validatePosition(0, 25) === 25, 'the correct position is returned');
      });

      it('should verify that two handles do not overlap', () => {
        const slider = shallow(<Slider values={[25, 75]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert(slider.validatePosition(0, 90) === 75, 'the handle reached its own max');
        assert(slider.validatePosition(1, 20) === 25, 'the handle reached its own min');
      });

      it('should honor getNextHandlePosition precondition', () => {
        const LEFT_MAX = 40;
        const LEFT_HANDLE_IDX = 0;

        const slider = shallow(<Slider
          values={[30]}
          getNextHandlePosition={
            (idx, pos) => (idx === LEFT_HANDLE_IDX && pos > LEFT_MAX ? LEFT_MAX : pos)
          }
        />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert(slider.validatePosition(0, 90) === 40, 'it honors the validatePosition override');
        assert(slider.validatePosition(0, 39) === 39, 'accepts the default value when condition is not triggered');
      });

      it('should throw if getNextHandlePosition returns invalid input', () => {
        const nanSlider = shallow((
          <Slider
            values={[30]}
            getNextHandlePosition={() => NaN}
          />
        )).dive().dive().instance();
        sinon.stub(nanSlider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert.throws(
          () => nanSlider.validatePosition(0, 100),
          TypeError,
          'getNextHandlePosition returned invalid position. Valid positions are floats between 0 and 100',
          'it throws if a non - float is returns from getNextHandlePosition',
        );

        const outOfBoundsSlider = shallow((
          <Slider
            values={[30]}
            getNextHandlePosition={() => -100}
          />)).dive().dive().instance();
        sinon.stub(outOfBoundsSlider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert.throws(
          () => outOfBoundsSlider.validatePosition(0, 100),
          TypeError,
          'getNextHandlePosition returned invalid position. Valid positions are floats between 0 and 100',
          'it throws if getNextHandlePosition returns out of bounds',
        );
      });
    });

    describe('canMove', () => {
      it('should confirm that we can move to the proposed position', () => {
        const slider = shallow(<Slider values={[50]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert.isFalse(slider.canMove(0, 120), 'cannot overflow max');
        assert.isFalse(slider.canMove(0, -20), 'cannot overflow min');
      });

      it('should not overflow the position of another handle', () => {
        const slider = shallow(<Slider values={[20, 60]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert.isFalse(slider.canMove(0, 80), 'cannot overflow second handle');
        assert.isFalse(slider.canMove(1, 10), 'cannot overflow first handle');
      });

      it('should return true if it can move to the position', () => {
        const slider = shallow(<Slider values={[25]} />).dive().dive().instance();
        sinon.stub(slider, 'getSliderBoundingBox').returns(sliderBoundingBox);

        assert.isTrue(slider.canMove(0, 40), 'sure you can move here');
      });

      it('should return false if the ref to the handle container node is not yet set', () => {
        const slider = shallow(<Slider values={[50]} />).dive().dive().instance();
        assert.isUndefined(slider.handleContainerNode, 'ref is not available');
        assert.isFalse(slider.canMove(0, 40), 'ref is not available');
      });
    });
  });

  describe('getClosestHandle', () => {
    it('should return the index of the closest handle given a position', () => {
      const slider = shallow(<Slider values={[0, 25, 50, 75, 100]} />).dive().dive().instance();
      assert(slider.getClosestHandle(55) === 2, 'the index of the handle at 50% is 2');
      assert(slider.getClosestHandle(89) === 4, 'the index of the handle at 100% is 4');
      assert(slider.getClosestHandle(4) === 0, 'the index of the handle at 0% is 0');
    });
  });

  describe('validateValues', () => {
    it('should validate that values do not overflow', () => {
      const slider = shallow(<Slider values={[50]} />).dive().dive().instance();

      assert(slider.validateValues([-20])[0] === 0, 'the value is set to the min');
      assert(slider.validateValues([120])[0] === 100, 'the value is set to the max');
    });

    it('should assert that values do not overlap', () => {
      const slider = shallow(<Slider />).dive().dive().instance();

      const newValues = slider.validateValues([80, 20]);

      assert(newValues[0] === 80, 'the first value is 80');
      assert(newValues[1] === 80, 'the second value is 80');
    });
  });

  describe('positionPercent', () => {
    it('should return correct position for horizontal orientation', () => {
      const box = {
        height: 10,
        left: 150,
        right: 200,
        top: 50,
        width: 300,
      };
      const slider = shallow(<Slider />).dive().dive().instance();

      assert.equal(slider.positionPercent(box.left, 55, box), 0, 'check returns min value');
      assert.equal(slider.positionPercent(box.left + box.width / 2, 55, box), 50, 'check returns middle value');
      assert.equal(slider.positionPercent(box.left + box.width, 55, box), 100, 'check returns max value');
    });

    it('should return correct position for vertical orientation', () => {
      const box = {
        height: 200,
        left: 50,
        right: 100,
        top: 50,
        width: 20,
      };
      const slider = shallow(<Slider orientation="vertical" />).dive().dive().instance();

      assert.equal(slider.positionPercent(55, box.top, box), 0, 'check returns min value');
      assert.equal(slider.positionPercent(55, box.top + box.height / 2, box), 50, 'check returns middle value');
      assert.equal(slider.positionPercent(55, box.top + box.height, box), 100, 'check returns max value');
    });

    it('should return correct position for horizontal orientation in RTL', () => {
      const box = {
        height: 10,
        left: 150,
        right: 200,
        top: 50,
        width: 300,
      };
      const slider = shallow(
        <DirectionProvider direction={DIRECTIONS.RTL}><Slider /></DirectionProvider>,
      )
        .find(Slider)
        .dive()
        .dive()
        .dive()
        .instance();

      assert.equal(slider.positionPercent(box.left, 55, box), 100, 'check returns min value');
      assert.equal(slider.positionPercent(box.left + box.width / 2, 55, box), 50, 'check returns middle value');
      assert.equal(slider.positionPercent(box.left + box.width, 55, box), 0, 'check returns max value');
    });
  });
});
