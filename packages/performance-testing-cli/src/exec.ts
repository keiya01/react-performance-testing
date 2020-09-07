import child_process from 'child_process';
import { logError } from './logger';

export const exec = (cmd: string, filepath: string) => {
  const { error } = child_process.spawnSync(cmd, [filepath], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  if (error) {
    logError(error);
  }
};