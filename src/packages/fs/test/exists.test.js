// @flow

import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';

import { mkdir, rmdir, writeFile, unlink } from 'fs';
import { sep, basename, dirname, join } from 'path';

import { exists } from '../index';

const TMP_PATH = join(sep, 'tmp', `lux-${Date.now()}`, 'exists-test.tmp');

describe('fs', () => {
  describe('#exists()', () => {

    before(() => createTmpFile(TMP_PATH));

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

    after(() => removeTmpFile(TMP_PATH));

  });
});

function createTmpFile(path: string) {
  return new Promise((resolve, reject) => {
    mkdir(dirname(path), undefined, (err) => {
      if (err) return reject(err);
      writeFile(path, 'exists-test', (error) => {
        if (error) return reject(error);
        resolve(path);
      });
    });
  });
}

function removeTmpFile(path: string) {
  return new Promise((resolve, reject) => {
    unlink(path, err => {
      if (err) return reject(err);
      rmdir(dirname(path), (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  });
}
