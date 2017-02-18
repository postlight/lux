// @flow
import { tmpdir } from 'os';
import { basename, dirname, join } from 'path';

import { exists } from '../index';

import { createTmpDir, createTmpFiles, removeTmpDir } from './utils';

const TMP_PATH = join(tmpdir(), `lux-${Date.now()}`);

describe('module "fs"', () => {
  describe('#exists()', () => {
    beforeAll(async () => {
      await createTmpDir(TMP_PATH);
      await createTmpFiles(TMP_PATH, 5);
    });

    it('is true if "PATH" exists', async () => {
      expect(await exists(TMP_PATH)).toBe(true);
    });

    it('is false if "PATH" does not exist', async () => {
      const emptyPath = join(dirname(TMP_PATH), 'does-not-exist.tmp');
      expect(await exists(emptyPath)).toBe(false);
    });

    it('is true if regexp "PATH" exists within "DIR"', async () => {
      const pathRegexp = new RegExp(basename(TMP_PATH));
      const fileExists = await exists(pathRegexp, dirname(TMP_PATH));
      expect(fileExists).toBe(true);
    });

    it('is false if regexp "PATH" does not exist within "DIR"', async () => {
      const emptyRegexp = new RegExp('does-not-exist.tmp');
      const fileExists = await exists(emptyRegexp, dirname(TMP_PATH));
      expect(fileExists).toBe(false);
    });

    afterAll(() => removeTmpDir(TMP_PATH));
  });
});
