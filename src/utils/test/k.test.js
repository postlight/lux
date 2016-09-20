// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import K from '../k';

describe('util K()', () => {
  it('always returns the context it is called with', () => {
    const obj = {};

    expect(Reflect.apply(K, 1, [])).to.equal(1);
    expect(Reflect.apply(K, obj, [])).to.equal(obj);
    expect(Reflect.apply(K, 'Test', [])).to.equal('Test');
  });
});
