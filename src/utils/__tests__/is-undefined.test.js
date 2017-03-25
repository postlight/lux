/* @flow */

import isUndefined from '../is-undefined';

describe('util isUndefined()', () => {
  test('returns false when falsy values are passed in as an argument', () => {
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(NaN)).toBe(false);
    expect(isUndefined(null)).toBe(false);
  });

  test('returns true when `undefined` is passed in as an argument', () => {
    expect(isUndefined()).toBe(true);
    expect(isUndefined(undefined)).toBe(true);
  });
});
