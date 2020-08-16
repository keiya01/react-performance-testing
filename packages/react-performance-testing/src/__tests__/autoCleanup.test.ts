import React from 'react';

// This is because `afterEach()` is invoked when index.ts is imported.
// Therefore we should set some condition before index.ts is imported.
const RPT_SKIP_AUTO_CLEANUP = process.env.RPT_SKIP_AUTO_CLEANUP;
process.env.RPT_SKIP_AUTO_CLEANUP = 'true';
jest.spyOn(window, 'afterEach');

import { perf } from '../index';

afterAll(() => {
  // @ts-ignore
  window.afterEach.mockRestore();
  process.env.RPT_SKIP_AUTO_CLEANUP = RPT_SKIP_AUTO_CLEANUP;
});

test('should not invoke afterEach() when RPT_SKIP_AUTO_CLEANUP is true', () => {
  perf(React);

  expect(window.afterEach).not.toBeCalled();
});
