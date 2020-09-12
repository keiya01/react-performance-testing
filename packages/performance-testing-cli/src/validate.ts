import fs from 'fs';
import { logError } from './logger';

export const validate = (argv: Record<string, any>) => {
  const { cmd, root, _ } = argv;
  let success = true;

  if (!cmd) {
    logError('You need to specify executing command');
    success = false;
  }

  const pathname = _[0] || root;

  if (!pathname) {
    logError('You need to specify file path');
    success = false;
  }

  if (pathname && !fs.existsSync(pathname)) {
    logError(`Could not find specified path: ${pathname}`);
    success = false;
  }

  return success;
};
