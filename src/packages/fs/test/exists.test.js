// @flow
import { tmpdir } from 'os';
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';

import { sep, basename, dirname, join } from 'path';

import {
  createTmpDir,
  createTmpFiles,
  removeTmpDir
} from './utils';

import { exists } from '../index';

const TMP_PATH = join(tmpdir(), `lux-${Date.now()}`);

describe('module "fs"', () => {
  describe('#exists()', () => {
    before(async () => {
      await createTmpDir(TMP_PATH);
      await createTmpFiles(TMP_PATH, 5);
    });

    it('is true if "PATH" exists', async () => {
      expect(await exists(TMP_PATH)).to.be.true;
    });

    it('is false if "PATH" does not exist', async () => {
      const emptyPath = join(dirname(TMP_PATH), 'does-not-exist.tmp');
      expect(await exists(emptyPath)).to.be.false;
    });

    it('is true if regexp "PATH" exists within "DIR"', async () => {
      const pathRegexp = new RegExp(basename(TMP_PATH));
      const fileExists = await exists(pathRegexp, dirname(TMP_PATH));
      expect(fileExists).to.be.true;
    });

    it('is false if regexp "PATH" does not exist within "DIR"', async () => {
      const emptyRegexp = new RegExp('does-not-exist.tmp');
      const fileExists = await exists(emptyRegexp, dirname(TMP_PATH));
      expect(fileExists).to.be.false;
    });

    after(() => removeTmpDir(TMP_PATH));
  });
});
