// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import normalizePort from '../utils/normalize-port';

describe('module "application"', () => {
  describe('util normalizePort()', () => {
    it('works with a string', () => {
      const result = normalizePort('3000');

      expect(result).to.equal(3000);
    });

    it('works with a number', () => {
      const result = normalizePort(3000);

      expect(result).to.equal(3000);
    });

    it('works with undefined', () => {
      const result = normalizePort();

      expect(result).to.equal(4000);
    });
  });
});
