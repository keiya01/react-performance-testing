export const toArgs = (argv: Record<string, any>, excludes: string[]) => {
  const args = [];
  const keys = Object.keys(argv);
  for (const key of keys) {
    if (excludes.includes(key)) {
      continue;
    }

    const value = argv[key];
    if (typeof value === 'boolean') {
      args.push(`--${key}`);
    }
    if (typeof value === 'string') {
      args.push(`--${key}='${value}'`);
    }
    if (typeof value === 'number') {
      args.push(`--${key}=${value}`);
    }
  }

  return args;
};
