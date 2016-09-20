// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import formatKey from '../utils/format-key';

describe('module "loader"', () => {
  describe('#formatKey()', () => {
    it('converts a key to kebab-case', () => {
      expect(formatKey('someKey')).to.equal('some-key');
      expect(formatKey('some_key')).to.equal('some-key');
    });

    it('can execute a formatter function on a key', () => {
      expect(formatKey('key', key => `some_${key}`)).to.equal('some-key');
    });
  });
});
