// @flow
import { expect } from 'chai';

import isObject from '../is-object';

describe('#isObject()', () => {
  it ('returns false when an `null` is passed in as an argument', () => {
    expect(isObject(null)).to.be.false;
  });

  it ('returns false when an `Array` is passed in as an argument', () => {
    expect(isObject([])).to.be.false;
  });

  it('returns true when an `Object` is passed in as an argument', () => {
    class SomeObject {}

    expect(isObject({})).to.be.true;
    expect(isObject(new SomeObject())).to.be.true;
    expect(isObject(Object.create(null))).to.be.true;
  });
});
