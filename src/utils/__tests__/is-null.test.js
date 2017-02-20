// @flow
import isNull from '../is-null';

describe('util isNull()', () => {
  it('returns false when an `Object` is passed in as an argument', () => {
    expect(isNull({})).toBe(false);
  });

  it('returns false when falsy values are passed in as an argument', () => {
    expect(isNull(0)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(NaN)).toBe(false);
    expect(isNull(undefined)).toBe(false);
  });

  it('returns true when `null` is passed in as an argument', () => {
    expect(isNull(null)).toBe(true);
  });
});
