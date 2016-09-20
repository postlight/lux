// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import isBuffer from '../is-buffer.js';

describe('util isBuffer()', () => {
  it('returns true when a `Buffer` is passed in as an argument', () => {
    expect(isBuffer(new Buffer('', 'utf8'))).to.be.true;
  });
});
