/* @flow */

import setType from '../set-type';

describe('util setType()', () => {
  test('returns the function call of the first and only argument', () => {
    expect(setType(() => 'Test')).toBe('Test');
  });
});
