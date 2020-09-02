import fs from 'fs';
import { logError } from './logger';

export const validate = (argv: Record<string, any>) => {
  const { cmd, root } = argv;

  if (!cmd) {
    logError('You need to specify executing command');
    return false;
  }

  if (!root) {
    logError('You need to specify root file path');
    return false;
  }

  if (!fs.existsSync(root)) {
    logError(`Could not find specified path: ${root}`);
    return false;
  }

  return true;
};
