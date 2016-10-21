# Rheostat

> A mobile, tablet, desktop, and accessible slider for the web.

![Rheostat demo](sample.gif)

## Install

`npm install rheostat`

## Props

The algorithm, by default [`linear`](src/algorithms/linear.js), the slider will use. Feel free to write
your own as long as it conforms to the shape.

```js
  algorithm: PropTypes.shape({
    getValue: PropTypes.func,
    getPosition: PropTypes.func,
  })
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

NOTE: `onChange` is called whenever the value is changed and committed. This happens at the end of
a drag, keypress, or click event. `onChange` is recommended when you wish to persist the values.

`onValuesUpdated` is a convenience event that is triggered while the value is being actively
changed. This includes dragging, click, or keypress. `onValuesUpdated` is recommended if you need
to work with the values before they're committed.

```js
  onChange: PropTypes.func
  onClick: PropTypes.func
  onKeyPress: PropTypes.func
  onSliderDragEnd: PropTypes.func
  onSliderDragMove: PropTypes.func
  onSliderDragStart: PropTypes.func
  onValuesUpdated: PropTypes.func
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

The values, by default 0 and 100.

```js
  values: PropTypes.arrayOf(PropTypes.number)
```

You can disable the slider to prevent the user from moving it.

```js
  disabled: PropTypes.bool
```

`react-with-styles` adds a `styles` object via a higher-order component See [Using `react-with-styles`](https://github.com/adamrneary/rheostat/blob/master/README.md#using-react-with-styles)

```js
  styles: PropTypes.object
```

## Usage

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

## Using `react-with-styles`

Rather than styling the component with css, we use `react-with-styles`, an interface compatible with
React Native, Aphrodite, JSS, and more to come. [Full instructions for `react-with-styles` are available](https://github.com/airbnb/react-with-styles), but the base implementation requires:

1. An interface for the styles library you choose (we use Aphrodite at Airbnb)
1. A theme file defining a unit and the 7 colors used by Rheostat ([example](https://github.com/airbnb/rheostat/blob/master/theme/default.js))
1. Registering your theme and interface as [in this example](https://github.com/airbnb/rheostat/blob/master/theme/initializeTheme.js) or below:

```js
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import ReactWithStylesThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';

import MyDefaultTheme from './MyDefaultTheme';
ReactWithStylesThemedStyleSheet.registerDefaultTheme(MyDefaultTheme);
ReactWithStylesThemedStyleSheet.registerInterface(aphroditeInterface);
```

## Live Playground

For more examples you can check out the storybook.

* Clone this repo on your machine.
* `npm install`
* `npm run storybook`
* Visit `http://localhost:9001/`.
