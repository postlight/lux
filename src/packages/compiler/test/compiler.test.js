// @flow
import path from 'path';

import { spy, stub } from 'sinon';

import { getTestApp } from '../../../../test/utils/get-test-app';
import { compile, onwarn } from '../index';

const Rollup = jest.mock('rollup');

describe('module "compiler"', () => {
  describe('#compile()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.unmock('rollup');
    });

    ['use strict', 'use weak'].forEach(opt => {
      describe(`- ${opt}`, () => {
        it('creates an instance of rollup with the correct config', async () => {
          const { path: dir } = await getTestApp();
          const entry = path.join(dir, 'dist', 'index.js')

          await compile(dir, 'test', {
            useStrict: opt === 'use strict'
          });

          expect(Rollup.rollup.calls).toMatchSnapshot();
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
      ).toBe(true);
    });

    it('ignores invalid warning types', () => {
      onwarn(warnings.UNUSED_EXTERNAL_IMPORT);
      expect(
        warnSpy.neverCalledWith(warnings.UNUSED_EXTERNAL_IMPORT.message)
      ).toBe(true);
    });
  });
});
