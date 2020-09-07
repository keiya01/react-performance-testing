import yargs from 'yargs';
import { options } from './options';

export const getArgv = () =>
  yargs.wrap(yargs.terminalWidth()).options(options).argv;
