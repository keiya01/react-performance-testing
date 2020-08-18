# jest-performance-testing(Experimental)

![npm](https://img.shields.io/npm/v/react-performance-testing)
[![codecov](https://codecov.io/gh/keiya01/react-performance-testing/branch/master/graph/badge.svg)](https://codecov.io/gh/keiya01/react-performance-testing)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/test/badge.svg)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/build/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

You can get benefit by using this lib with [react-performance-testing](https://github.com/keiya01/react-performance-testing#readme). This lib is created to improve DX for react-performance-test users. You can write test **quickly** and **easy**.

## Table of Contents

- [Installation](#installation)
- [API](#api)
  - [toBeMounted](#toBeMounted)
  - [toBeMountedWithin](#toBeMountedWithin)
  - [toBeUpdatedWithin](#toBeUpdatedWithin)
  - [toBeRenderedTimes](#toBeRenderedTimes)
- [LICENSE](#license)

## Installation

npm:

```sh
npm install --save-dev jest-performance-testing
```

yarn:

```sh
yarn add --dev jest-performance-testing
```

## API

### toBeMounted
`toBeMounted()`  
  
This matcher is to check if component is mounted.

```js
expect(renderCount.current.Component).toBeMounted();
```

You can use `renderTime` as bellow.

```js
expect(renderTime.current.Component).toBeMounted();
```

### toBeMountedWithin
`toBeMountedWithin(mountedTime: number)`  
  
This matcher is to check if mounted time is less than expected time.

```js
expect(renderTime.current.Component).toBeMountedWithin(16); // ms
```

### toBeUpdatedWithin
`toBeUpdatedWithin(updatedTime: number[])`  
  
This matcher is to check if some updated time are less than expected time.

```js
expect(renderTime.current.Component).toBeUpdatedWithin([
  10, // first render
  15, // second render
  20, // third render
]);
```

If you have same render time, you can write as bellow.

```js
// All items are 16ms
expect(renderTime.current.Component).toBeUpdatedWithin(16); 
```

### toBeRenderedTimes
`toBeRenderedTimes(renderedTimes: number)`  
  
This matcher is to check if number of renders are equality.

```js
expect(renderCount.current.Component).toBeRenderedTimes(1);
```

## LICENSE

[MIT](LICENSE)
