/* @flow */

import compact from '../compact';

describe('util compact()', () => {
  it('removes null and undefined values from an `Array`', () => {
    const result = compact([0, 'a', 1, null, {}, undefined, false]);

    expect(result).toHaveLength(5);
    expect(result).not.toContain(null);
    expect(result).not.toContain(undefined);
  });

  it('removes null and undefined values from an `Object`', () => {
    const values = {
      a: 0,
      b: 'a',
      c: 1,
      d: {},
      e: false
    };

    const result = compact({
      ...values,
      f: null,
      g: undefined
    });

    expect(result).toEqual(values);
  });
});
