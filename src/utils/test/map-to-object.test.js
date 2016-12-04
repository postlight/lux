// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import mapToObject from '../map-to-object';

describe('util mapToObject()', () => {
  it('returns an object containing key, value pairs from a map', () => {
    expect(mapToObject(
      new Map([
        ['x', 1],
        ['y', 2],
        ['z', 3]
      ])
    )).to.deep.equal({
      x: 1,
      y: 2,
      z: 3
    });
  });
});
