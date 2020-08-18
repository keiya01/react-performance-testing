export const isNotMounted = () => ({
  pass: false,
  message: () =>
    'Specified component could not be found. It is possible to be not mounted or to be a typo.',
});
