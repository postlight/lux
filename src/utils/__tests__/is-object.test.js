/* @flow */



import isObject from '../is-object';

describe('util isObject()', () => {
  it('returns false when an `null` is passed in as an argument', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns false when an `Array` is passed in as an argument', () => {
    expect(isObject([])).toBe(false);
  });

  it('returns true when an `Object` is passed in as an argument', () => {
    class SomeObject {}

    expect(isObject({})).toBe(true);
    expect(isObject(new SomeObject())).toBe(true);
    expect(isObject(Object.create(null))).toBe(true);
  });
});
