// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import present from '../present';

describe('util present()', () => {
  it('returns false when null is an argument', () => {
    expect(present('Test', 0, {}, [], true, false, NaN, null)).to.be.false;
  });

  it('returns false when undefined is an argument', () => {
    expect(present('Test', 0, {}, [], true, false, NaN, undefined)).to.be.false;
  });

  it('returns true when there are no null or undefined arguments', () => {
    expect(present('Test', 0, {}, [], true, false, NaN)).to.be.true;
  });
});
