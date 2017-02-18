/* @flow */
/* eslint-disable import/first */
jest.mock('fs');

import * as nativeFs from 'fs';

import * as fs from '../index';
import Watcher from '../watcher';

describe('module "fs"', () => {
  const cb = expect.any(Function);

  afterAll(() => {
    jest.unmock('fs');
  });

  describe('#mkdir()', () => {
    it('delegates to node fs#mkdir', async () => {
      const mode = 511;
      const name = 'test-mkdir';

      await fs.mkdir(name, mode);
      expect(nativeFs.mkdir).toBeCalledWith(name, mode, cb);
    });
  });

  describe('#rmdir()', () => {
    it('delegates to node fs#rmdir', async () => {
      const name = 'test-rmdir';

      await fs.rmdir(name);
      expect(nativeFs.rmdir).toBeCalledWith(name, cb);
    });
  });

  describe('#readdir()', () => {
    it('delegates to node fs#readdir', async () => {
      const name = 'test-readdir';

      await fs.readdir(name);
      expect(nativeFs.readdir).toBeCalledWith(name, cb);
    });
  });

  describe('#readFile()', () => {
    it('delegates to node fs#readFile', async () => {
      const name = 'test-readFile';

      await fs.readFile(name);
      expect(nativeFs.readFile).toBeCalledWith(name, {}, cb);
    });
  });

  describe('#writeFile()', () => {
    it('delegates to node fs#writeFile', async () => {
      const name = 'test-writeFile';
      const data = 'test data';

      await fs.writeFile(name, data);
      expect(nativeFs.writeFile).toBeCalledWith(name, data, undefined, cb);
    });
  });

  describe('#appendFile()', () => {
    it('delegates to node fs#appendFile', async () => {
      const name = 'test-appendFile';
      const data = 'test data';

      await fs.appendFile(name, data);
      expect(nativeFs.appendFile).toBeCalledWith(name, data, {}, cb);
    });
  });

  describe('#stat()', () => {
    it('delegates to node fs#stat', async () => {
      const name = 'test-unlink';

      await fs.stat(name);
      expect(nativeFs.stat).toBeCalledWith(name, cb);
    });
  });

  describe('#unlink()', () => {
    it('delegates to node fs#unlink', async () => {
      const name = 'test-unlink';

      await fs.unlink(name);
      expect(nativeFs.unlink).toBeCalledWith(name, cb);
    });
  });

  describe('#watch()', () => {
    it('resolves with an instance of Watcher', async () => {
      expect(await fs.watch('test-watch')).toBeInstanceOf(Watcher);
    });
  });
});
