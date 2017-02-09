// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import K from '../k';

describe('util K()', () => {
  it('always returns the context it is called with', () => {
    const obj = {};

    expect(K.call(1)).to.equal(1);
    expect(K.call(obj)).to.equal(obj);
    expect(K.call('Test')).to.equal('Test');
  });
});
