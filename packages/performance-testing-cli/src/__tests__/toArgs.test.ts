import { toArgs } from '../toArgs';

test('should get args correctly', () => {
  expect(
    toArgs(
      {
        _: ['abc'],
        runInBand: true,
        path: 'test',
        count: 2,
        $0: 'Hello',
      },
      ['_', '$0'],
    ),
  ).toEqual(['--runInBand', "--path='test'", '--count=2']);
});
