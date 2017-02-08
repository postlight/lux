// @flow
import { tmpdir } from 'os';



import { join } from 'path';

import { rmrf, exists } from '../index';
import {
  getTmpFile,
  createTmpDir,
  removeTmpDir,
  createTmpFiles
} from './utils';

describe('module "fs"', () => {
  describe('#rmrf()', () => {
    let tmpDirPath: string;

    beforeEach(async () => {
      tmpDirPath = join(tmpdir(), `lux-${Date.now()}`);

      await createTmpDir(tmpDirPath);
      await createTmpFiles(tmpDirPath, 5);
    });

    it('removes a file', async () => {
      const tmpFilePath = await getTmpFile(tmpDirPath);
      await rmrf(tmpFilePath);
      expect(await exists(tmpFilePath)).toBe(false);
    });

    it('removes a directory and its contents', async () => {
      await rmrf(tmpDirPath);
      expect(await exists(tmpDirPath)).toBe(false);
    });

    afterEach(async () => {
      if (await exists(tmpDirPath)) {
        await removeTmpDir(tmpDirPath);
      }
    });
  });
});
