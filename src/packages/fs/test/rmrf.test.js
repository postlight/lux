//@flow

import { expect } from 'chai';
import { it, describe, beforeEach, afterEach } from 'mocha';

import { mkdir, rmdir, writeFile, readdir, unlink } from 'fs';
import { sep, join } from 'path';

import range  from '../../../utils/range';
import createRootTmpDir from './utils/create-tmp-dir';

import { rmrf, exists } from '../index';

describe('fs', () => {
  describe('#rmrf()', () => {
    let tmpDirPath: string;

    beforeEach(async () => {
      tmpDirPath = join(sep, 'tmp', `lux-${Date.now()}`);

      await createRootTmpDir();
      await createTmpDir(tmpDirPath);
    });

    it('removes a file', async () => {
      const tmpFilePath = await getTmpFile(tmpDirPath);
      await rmrf(tmpFilePath);
      expect(await exists(tmpFilePath)).to.be.false;
    });

    it('removes a directory and its contents', async () => {
      await rmrf(tmpDirPath);
      expect(await exists(tmpDirPath)).to.be.false;
    });

    afterEach(async () => {
      if (await exists(tmpDirPath)) {
        await removeTmpDir(tmpDirPath);
      }
    });
  });
});

function createTmpDir(path: string) {
  return new Promise((resolve, reject) => {
    mkdir(path, undefined, (err) => {
      if (err) return reject(err);
      const filePaths = Array.from(range(1, 5))
        .map(() => join(path, `${Date.now()}.tmp`));
      createTmpFiles(filePaths).then(resolve, reject);
    });
  });
}

function createTmpFiles(filePaths: Array<string>) {
  return Promise.all(filePaths.map((filePath) => {
    return new Promise((resolve, reject) => {
      writeFile(filePath, '', (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }));
}

function removeTmpDir(path: string) {
  return new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      if (err) return reject(err);
      const filePaths = files.map(fileName => join(path, fileName));
      removeTmpFiles(filePaths)
        .then(() => {
          rmdir(path, (error) => {
            if (error) reject(error);
            resolve();
          });
        })
        .catch((error) => reject(error));
    });
  });
}

function removeTmpFiles(filePaths: Array<string>) {
  return Promise.all(filePaths.map((filePath) => {
    return new Promise((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }));
}

function getTmpFile (path: string) {
  return new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      if (err) return reject(err);
      resolve(join(path, files[0]));
    });
  });
}
