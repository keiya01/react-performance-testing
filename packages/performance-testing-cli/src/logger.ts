import { red } from 'chalk';

export const logError = (msg: Error | string) =>
  console.error(red('Error: '), msg);
