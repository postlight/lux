// @flow


import entries from '../entries';

describe('util entries()', () => {
  it('creates an `Array` of key-value pairs from an object', () => {
    expect(entries({
      a: 1,
      b: 2,
      c: 3
    })).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
});
