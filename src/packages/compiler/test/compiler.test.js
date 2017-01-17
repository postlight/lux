// @flow
import path from 'path';

import * as Rollup from 'rollup';
import { spy, stub } from 'sinon';
import { expect } from 'chai';
import { it, describe, afterEach, beforeEach } from 'mocha';

import { getTestApp } from '../../../../test/utils/get-test-app';
import { compile, onwarn } from '../index';

describe('module "compiler"', () => {
  describe('#compile()', () => {
    let rollupStub;

    beforeEach(() => {
      rollupStub = stub(Rollup, 'rollup', () => ({
        write: () => Promise.resolve()
      }));
    });

    afterEach(() => {
      rollupStub.restore();
    });

    ['use strict', 'use weak'].forEach(opt => {
      describe(`- ${opt}`, () => {
        it('creates an instance of rollup with the correct config', async () => {
          const { path: dir } = await getTestApp();
          const entry = path.join(dir, 'dist', 'index.js')

          await compile(dir, 'test', {
            useStrict: opt === 'use strict'
          });

          const { args: [rollupConfig] } = rollupStub.getCall(0);

          expect(rollupConfig).to.have.property('entry', entry);
          expect(rollupConfig)
            .to.have.property('plugins')
            .and.be.an('array')
            .with.lengthOf(6);
        });
      });
    });
  });

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

    beforeEach(() => {
      warnSpy = spy(console, 'warn');
    });

    afterEach(() => {
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
