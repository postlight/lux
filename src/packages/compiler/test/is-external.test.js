// @flow
import path from 'path';

import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe, beforeEach } from 'mocha';

import isExternal from '../utils/is-external';

const SRC = path.join(__dirname, '..', '..', '..');

describe('module "compiler"', () => {
  describe('util isExternal()', () => {
    it('returns a function that accepts a single argument', () => {
      expect(isExternal(SRC)).to.be.a('function').with.lengthOf(1);
    });

    describe('external()', () => {
      let external: (id: string) => boolean;

      beforeEach(() => {
        external = isExternal(SRC);
      });

      it('returns `true` for external modules', () => {
        expect(external('knex')).to.be.true;
      });

      it('returns `false` for aliased file paths', () => {
        expect(external('app/models/user')).to.be.false;
      });

      it('returns `false` for absolute file paths', () => {
        expect(external('/absolute/path/to/app/models/user')).to.be.false;
        expect(external('C:/absolute/path/to/app/models/user')).to.be.false;
        expect(external(
          'C:\\absolute\\path\\to\\app\\models\\user'
        )).to.be.false;
      });

      it('returns `false` for relative file paths', () => {
        expect(external('./app/models/user')).to.be.false;
      });

      it('returns `false` for "LUX_LOCAL"', () => {
        expect(external('LUX_LOCAL')).to.be.false;
      });

      it('returns `false` for "lux-framework"', () => {
        expect(external('lux-framework')).to.be.false;
      });

      it('returns `false` for "babelHelpers"', () => {
        expect(external('babelHelpers')).to.be.false;
      });
    });
  });
});
