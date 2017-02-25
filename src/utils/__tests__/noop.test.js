// @flow
import noop from '../noop';

describe('util noop()', () => {
  it('returns undefined', () => {
    expect(noop()).toBeUndefined();
  });
});
