// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import isUndefined from '../is-undefined';

describe('#isUndefined()', () => {
  it('returns false when falsy values are passed in as an argument', () => {
    expect(isUndefined(0)).to.be.false;
    expect(isUndefined('')).to.be.false;
    expect(isUndefined(NaN)).to.be.false;
    expect(isUndefined(null)).to.be.false;
  });

  it('returns true when `undefined` is passed in as an argument', () => {
    expect(isUndefined()).to.be.true;
    expect(isUndefined(void 0)).to.be.true;
    expect(isUndefined(undefined)).to.be.true;
  });
});
