// @flow
import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe, after, before, beforeEach } from 'mocha';

import { onwarn } from '../index';

describe('module "compiler"', () => {
  describe('#onwarn()', () => {
    let warnSpy;
    const warnings = {
      EMPTY_BUNDLE: {
        code: 'EMPTY_BUNDLE',
        message: 'Generated an empty bundle'
      },
      UNUSED_EXTERNAL_IMPORT: {
        code: 'UNUSED_EXTERNAL_IMPORT',
        message: (
          `'unused', 'notused' and 'neverused' are imported from external`
          + `module 'external' but never used`
        )
      }
    };

    before(() => {
      warnSpy = spy(console, 'warn');
    });

    beforeEach(() => {
      warnSpy.reset();
    });

    after(() => {
      warnSpy.restore();
    });

    it('outputs valid warning types to stderr', () => {
      onwarn(warnings.EMPTY_BUNDLE);
      expect(
        warnSpy.calledWithExactly(warnings.EMPTY_BUNDLE.message)
      ).to.be.true;
    });

    it('ignores invalid warning types', () => {
      onwarn(warnings.UNUSED_EXTERNAL_IMPORT);
      expect(
        warnSpy.neverCalledWith(warnings.UNUSED_EXTERNAL_IMPORT.message)
      ).to.be.true;
    });
  });
});
