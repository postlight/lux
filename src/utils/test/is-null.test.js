// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import isNull from '../is-null';

describe('#isNull()', () => {
  it('returns false when an `Object` is passed in as an argument', () => {
    expect(isNull({})).to.be.false;
  });

  it('returns false when falsy values are passed in as an argument', () => {
    expect(isNull(0)).to.be.false;
    expect(isNull('')).to.be.false;
    expect(isNull(NaN)).to.be.false;
    expect(isNull(undefined)).to.be.false;
  });

  it('returns true when `null` is passed in as an argument', () => {
    expect(isNull(null)).to.be.true;
  });
});
