export const options = {
  cmd: {
    alias: 'c',
    describe: 'Run the given command.',
    requiresArg: true,
    type: 'string',
  },
  root: {
    alias: 'r',
    describe: 'Run with each file under the given directory path.',
    requiresArg: true,
    type: 'string',
  },
  match: {
    alias: 'm',
    describe: 'Run with matched files. You can use own glob pattern.',
    requiresArg: true,
    type: 'string',
    default: '**/*.(test|spec).(j|t)s(x)?',
  },
} as const;
