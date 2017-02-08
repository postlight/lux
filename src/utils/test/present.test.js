// @flow
import present from '../present';

describe('util present()', () => {
  it('returns false when null is an argument', () => {
    expect(present('Test', 0, {}, [], true, false, NaN, null)).toBe(false);
  });

  it('returns false when undefined is an argument', () => {
    expect(present('Test', 0, {}, [], true, false, NaN, undefined)).toBe(false);
  });

  it('returns true when there are no null or undefined arguments', () => {
    expect(present('Test', 0, {}, [], true, false, NaN)).toBe(true);
  });
});
