/* @flow */

import noop from '../noop';

describe('util noop()', () => {
  test('returns undefined', () => {
    expect(noop()).toBeUndefined();
  });
});
