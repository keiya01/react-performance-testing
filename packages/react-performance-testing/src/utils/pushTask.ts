import { W } from '../constants/globals';

export const pushTask = (cb: () => void) => {
  W.setImmediate(cb);
};
