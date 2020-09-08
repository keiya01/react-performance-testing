# performance-testing-cli(Experimental)

![npm](https://img.shields.io/npm/v/react-performance-testing)
[![codecov](https://codecov.io/gh/keiya01/react-performance-testing/branch/master/graph/badge.svg)](https://codecov.io/gh/keiya01/react-performance-testing)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/test/badge.svg)
![GitHub Workflow Status](https://github.com/keiya01/react-performance-testing/workflows/build/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

If you use `renderTime`, you can get benefit by using this lib with [react-performance-testing](https://github.com/keiya01/react-performance-testing#readme). This lib is created to improve DX for react-performance-test users. You can execute all test at once by using this library.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [LICENSE](#license)

## Installation

npm:

```sh
npm install --save-dev performance-testing-cli
```

yarn:

```sh
yarn add --dev performance-testing-cli
```

## Usage

You can test render time at once. But you should write **one test case in one file**. Because node.js has feature called inline caching. Inline caching is make our code be fast but we can not measure render time correctly.  
But this library resolve this problem by executing test in another process.

You can use as below.

```sh
perf --cmd='jest' --root='performance'
```

**Note**: You need to separate directory to generally test and `renderTime` test.

You can check example [here](https://github.com/keiya01/react-performance-testing/tree/master/example).

## Options

- **cmd** ... Specify your test command like `jest`, `mocha`.

- **root** ... Specify your root directory you want to test performance.

## LICENSE

[MIT](LICENSE)
