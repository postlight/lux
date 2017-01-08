// @flow
import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import isExternal from '../utils/is-external';

describe('module "compiler"', () => {
  describe('util isExternal()', () => {
    it('returns `true` for external modules', () => {
      expect(isExternal('', 'knex')).to.be.true;
    });

    it('returns `false` for aliased file paths', () => {
      expect(isExternal('', 'app/models/user')).to.be.false;
    });

    it('returns `false` for absolute file paths', () => {
      expect(isExternal(
        '/absolute/path/to',
        '/absolute/path/to/app/models/user'
      )).to.be.false;
    });

    it('returns `false` for relative file paths', () => {
      expect(isExternal('', './app/models/user')).to.be.false;
    });

    it('returns `false` for "LUX_LOCAL"', () => {
      expect(isExternal('', 'LUX_LOCAL')).to.be.false;
    });

    it('returns `false` for "lux-framework"', () => {
      expect(isExternal('', 'lux-framework')).to.be.false;
    });

    it('returns `false` for "babelHelpers"', () => {
      expect(isExternal('', 'babelHelpers')).to.be.false;
    });
  });
});
