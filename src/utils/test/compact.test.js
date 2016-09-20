// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import compact from '../compact';

describe('util compact()', () => {
  it('removes null and undefined values from an `Array`', () => {
    const result = compact([0, 'a', 1, null, {}, undefined, false]);

    expect(result).to.have.lengthOf(5);
    expect(result).to.not.include.members([null, undefined]);
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

    expect(result).to.deep.equal(values);
  });
});
