// @flow
import noop from '../noop';

describe('util noop()', () => {
  it('does not throw', () => {
    expect(noop).not.toThrow();
  });

  it('returns undefined', () => {
    expect(noop()).toBeUndefined();
  });
});
