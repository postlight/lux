// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import * as diff from '../diff';

describe('util diff', () => {
  describe('.map()', () => {
    it('returns a map containing the difference between two maps', () => {
      const subjectA = new Map([
        ['x', 1]
      ]);

      const subjectB = new Map([
        ['x', 1],
        ['y', 2]
      ]);

      const result = diff.map(subjectA, subjectB);

      expect(result)
        .to.be.an.instanceOf(Map)
        .and.have.property('size', 1);

      expect(Array.from(result)).to.deep.equal([
        ['y', 2]
      ]);
    });  
  });
});
