// @flow

import { expect } from 'chai';
import { it, describe, before, after, beforeEach, afterEach } from 'mocha';
import { join } from 'path';
import { spy } from 'sinon';

import { createTmpDir, getTmpFile, createTmpFiles } from './utils';
import * as fs from '../index';

import type { Spy } from 'sinon';

describe('fs', () => {

  let spies: {[ module: string ]: Spy } = {};
  let tmpDirPath: string;
  const spiedMethods = [
    'mkdir',
    'rmdir',
    'readdir',
    'readFile',
    'writeFile',
    'appendFile',
    'stat',
    'unlink',
  ];

  before(() => {
    // wrap node fs methods in spies to test delegation
    const nativeFs = require('fs');
    spies = spiedMethods.reduce((memo, methodName) => {
      memo[methodName] = spy(nativeFs, methodName);
      return memo;
    }, spies);
  });

  after(() => {
    // unwrap spies of node fs methods
    spies = spiedMethods.reduce((memo, methodName) => {
      memo[methodName].restore();
      Reflect.deleteProperty(memo, methodName);
      return memo;
    }, spies);
  });

  beforeEach(async () => {
    tmpDirPath = `/tmp/lux-${Date.now()}`;
    await createTmpDir(tmpDirPath);
  });

  afterEach(async () => {
    if (tmpDirPath) {
      await fs.rmrf(tmpDirPath);
      spiedMethods.forEach((methodName) => {
        spies[methodName].reset();
      });
    }
  });

  describe('#mkdir', () => {
    it('delegates to node fs#mkdir', async () => {
      const dirPath = join(tmpDirPath, 'test-mkdir');
      await fs.mkdir(dirPath);
      expect(spies['mkdir'].calledWith(dirPath)).to.be.true;
    });
    it('returns a promise', () => {
      const dirPath = join(tmpDirPath, 'test-mkdir');
      returnsPromiseSpec('mkdir', dirPath)();
    });
  });

  describe('#rmdir', () => {
    it('delegates to node fs#rmdir', async () => {
      await fs.rmdir(tmpDirPath);
      expect(spies['rmdir'].calledWith(tmpDirPath)).to.be.true;
    });
    it('returns a promise', returnsPromiseSpec('rmdir', tmpDirPath));
  });

  describe('#readdir', () => {
    it('delegates to node fs#readdir', async () => {
      await fs.readdir(tmpDirPath);
      expect(spies['readdir'].calledWith(tmpDirPath)).to.be.true;
    });
    it('returns a promise', returnsPromiseSpec('readdir', tmpDirPath));
  });

  describe('#readFile', () => {
    let tmpFilePath: string;

    beforeEach(async () => {
      await createTmpFiles(tmpDirPath, 5);
      tmpFilePath = await getTmpFile(tmpDirPath);
    });

    it('delegates to node fs#readFile', async () => {
      await fs.readFile(tmpFilePath);
      expect(spies['readFile'].calledWith(tmpFilePath)).to.be.true;
    });
    it('returns a promise', returnsPromiseSpec('readFile', tmpFilePath));
  });

  describe('#writeFile', () => {
    let tmpFilePath: string;

    beforeEach(async () => {
      await createTmpFiles(tmpDirPath, 5);
      tmpFilePath = await getTmpFile(tmpDirPath);
    });

    it('delegates to node fs#writeFile', async () => {
      await fs.writeFile(tmpFilePath, 'test data');
      expect(spies['writeFile'].calledWith(tmpFilePath)).to.be.true;
    });
    it('returns a promise', returnsPromiseSpec('writeFile', tmpFilePath));
  });

  describe('#appendFile', () => {
    let tmpFilePath: string;

    beforeEach(async () => {
      await createTmpFiles(tmpDirPath, 5);
      tmpFilePath = await getTmpFile(tmpDirPath);
    });

    it('delegates to node fs#appendFile', async () => {
      await fs.appendFile(tmpFilePath, 'test data');
      expect(spies['appendFile'].calledWith(tmpFilePath));
    });
    it('returns a promise', returnsPromiseSpec('appendFile', tmpFilePath));
  });

  describe('#stat', () => {
    let tmpFilePath: string;

    beforeEach(async () => {
      await createTmpFiles(tmpDirPath, 5);
      tmpFilePath = await getTmpFile(tmpDirPath);
    });

    it('delegates to node fs#stat', async () => {
      await fs.stat(tmpFilePath);
      expect(spies['stat'].calledWith(tmpFilePath));
    });
    it('returns a promise', returnsPromiseSpec('stat', tmpFilePath));
  });

  describe('#unlink', () => {
    let tmpFilePath: string;

    beforeEach(async () => {
      await createTmpFiles(tmpDirPath, 5);
      tmpFilePath = await getTmpFile(tmpDirPath);
    });

    it('delegates to node fs#unlink', async () => {
      await fs.unlink(tmpFilePath);
      expect(spies['unlink'].calledWith(tmpFilePath));
    });
    it('returns a promise', returnsPromiseSpec('unlink', tmpFilePath));
  });
});

function returnsPromiseSpec(
  method: string,
  ...args: Array<mixed>
): (done?: () => void) => void | Promise<mixed> {
  return function () {
    const res = Reflect.apply(fs[method], fs, args);
    expect(res).to.be.an.instanceOf(Promise);
  };
}
