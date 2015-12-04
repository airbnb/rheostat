# Rheostat

> A mobile, tablet, desktop, and accessible slider for the web.

## Install

`npm install rheostat`

## Props

The algorithm, by default [`linear`](src/utils/linear.js), the slider will use. Feel free to write
your own as long as it conforms to the shape.

```js
  algorithm: PropTypes.shape({
    getValue: PropTypes.func,
    getPosition: PropTypes.func,
  })
```

Custom class name that will be applied to the root of Rheostat.

```js
  className: PropTypes.string
```

Custom React component overrides for both the handles, and the "progress" bar.

```js
  handle: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  progressBar: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
```

The maximum and minimum possible values, by default 0 - 100.

```js
  max: PropTypes.number
  min: PropTypes.number
```

`pitComponent` is a custom React component for rendering "pits" across the bar.
`pitPoints` is the set of points at which it will render a pit. Points are an array
of `values` on the slider.

```js
  pitComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  pitPoints: PropTypes.arrayOf(PropTypes.number)
```

Event handlers. Note, `onValuesChanged` gets called every time the value is changed
(while dragging) whereas `onValuesSet` is only called once the values are set (once dragging ends).

`onValuesSet` is called on every key press, when dragging ends, or if a user clicks on any part
of the bar to set a value.

```js
  onClick: PropTypes.func
  onKeyPress: PropTypes.func
  onSliderEnd: PropTypes.func
  onSliderMove: PropTypes.func
  onSliderStart: PropTypes.func
  onValuesChanged: PropTypes.func
  onValuesSet: PropTypes.func
```

`snap` is a boolean which controls the slider's snapping behavior.
`snapPoints` is an array of `values` on the slider where the slider should snap to.

If `snap` is set to true and no `snapPoints` are set then the slider is snapped into an absolute
position. For example, on a scale of 1-10 if the slider is let go at the 54% mark it'll pick the
value 5 and snap to 50%.

```js
  snap: PropTypes.bool
  snapPoints: PropTypes.arrayOf(PropTypes.number)
```

The tab index to start the first handler on, by default 1.

```js
  tabIndex: PropTypes.number
```

The values, by default 0 and 100.

```js
  values: PropTypes.arrayOf(PropTypes.number)
```

## Usage

> Important: Make sure to include the [css file](slider.css) or feel free to create your own.

* Simple.

```js
import Rheostat from 'rheostat';

ReactDOM.render(<Rheostat />, document.getElementById('slider-root'));
```

* A slider with a multiple handles.

```js
import Rheostat from 'rheostat';

ReactDOM.render((
  <Rheostat
    min={1}
    max={100}
    values={[1, 100]}
  />
), document.getElementById('slider-root'));
```

## Live Playground

For more examples you can check out the live playground.

* Clone this repo on your machine.
* `npm install`
* `npm run playground`
* Visit `http://localhost:8989/`.
