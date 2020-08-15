import { cleanup } from './perf';

// Auto cleanup with Jest, Mocha, Jasmine or some lib that is supporting teardown().
if (!process.env.RPT_SKIP_AUTO_CLEANUP) {
  /* istanbul ignore else */
  if (typeof afterEach === 'function') {
    afterEach(cleanup);
    // @ts-ignore
  } else if (typeof teardown === 'function') {
    // @ts-ignore
    teardown(cleanup);
  }
}
