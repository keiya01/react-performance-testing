import child_process from 'child_process';
import { logError } from './logger';

export const exec = (cmd: string, filepath: string, args: string[]) => {
  return new Promise((resolve, reject) => {
    const { error } = child_process.spawnSync(cmd, [filepath, ...args], {
      stdio: 'inherit',
      env: { ...process.env },
    });

    if (error) {
      logError(error);
      return reject(error);
    }
    return resolve();
  });
};
