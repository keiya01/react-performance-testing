import { pushTask } from './utils/pushTask';

export const wait = (callback: () => void) =>
  new Promise((resolve) =>
    pushTask(() => {
      callback();
      resolve();
    }),
  );
