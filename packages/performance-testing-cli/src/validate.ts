import fs from 'fs';
import { logError } from './logger';

export const validate = (argv: Record<string, any>) => {
  const { cmd, root } = argv;
  let success = true;

  if (!cmd) {
    logError('You need to specify executing command');
    success = false;
  }

  if (!root) {
    logError('You need to specify root file path');
    success = false;
  }

  if (root && !fs.existsSync(root)) {
    logError(`Could not find specified path: ${root}`);
    success = false;
  }

  return success;
};
