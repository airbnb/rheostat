# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [4.1.1] - 2020-01-16
- [fix][Slider] Fix "TypeError: Cannot read 'getBoundingClientRect' of null"

## [4.1.0] - 2019-10-21
- [new][Deps] Update `react-with-styles` ^4.0.1 -> ^4.1.0

## [4.0.1] - 2019-09-11
- [fix][Deps] Update `react-with-styles` ^4.0.0 -> ^4.0.1

## [4.0.0] - 2019-09-09
- [new][Deps] Update `react-with-styles` ^3.2.3 -> ^4.0.0
- [breaking][deps] babel 7, and other deps (drops node < 6)
- [new][Deps] update `airbnb-prop-types`, `prop-types`, `react-with-styles`

## [3.0.2] - 2018-12-10
- [fix] Fix position calculations for 'vertical' mode ([#199](https://github.com/airbnb/rheostat/pull/199))

## [3.0.1] - 2018-07-17
- [fix] Transpile initialize script ([#182](https://github.com/airbnb/rheostat/pull/182))

## [3.0.0] - 2018-07-05
- [breaking] drop v0.13 support
- [breaking] Upgrade `rheostat` to use `react-with-styles` ([#161](https://github.com/airbnb/rheostat/pull/161), [#162](https://github.com/airbnb/rheostat/pull/162), [#163](https://github.com/airbnb/rheostat/pull/163), [#164](https://github.com/airbnb/rheostat/pull/164), [#166](https://github.com/airbnb/rheostat/pull/166), [#168](https://github.com/airbnb/rheostat/pull/168), [#172](https://github.com/airbnb/rheostat/pull/172))
- [breaking] Do not call `onChange` when values are manually updated ([#178](https://github.com/airbnb/rheostat/pull/178))

## [2.2.0] - 2018-05-21

- Add getNextHandlePosition prop to allow custom movement validation (#126)
- Fixes React@16 errors about invalid typed props. (#138)

## [2.1.3] - 2018-01-03

### Fixes

- revert jsnext:main extension removal (#135)

## [2.1.2] - 2018-01-02

### Fixes

- Slider: avoid key={0} (#106)
- Use math.round instead of math.floor for getting value with geometric algorithm (#131)

### Refactors

- Slider: use function refs instead of string refs (#112)
- Memoize pits styles (#123, #130)

## [2.1.1] - 2017-07-11

### Fixed

- use prop-types + create-react-class packages (#73)
- ensure `Object.assign` is transformed to `object.assign`

## [2.1.0] - 2016-11-10

### Changed

- Up/Down keys also move the slider now.

## [2.0.1] - 2016-10-19

### Fixed

- Eliminate slidingIndex of -1 (#33)

## [2.0.0] - 2016-08-22

### Changed

- A11y for tabbing between handles.
- Changed slider handles from div to button.

## [1.1.2] - 2016-07-08

### Fixed

- React v15 support.

## [1.1.1] - 2016-06-27

### Added

- A geometric algorithm.

## [1.1.0] - 2016-06-22

### Added

- New prop for disabling the slider.

## [1.0.0] - 2016-01-21

Initial Release
