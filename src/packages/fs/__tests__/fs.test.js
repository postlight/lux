/* @flow */

import * as path from 'path';
// $FlowIgnore
import { __reset__ } from 'fs';

import * as fs from '../index';

jest.mock('fs');

describe('module "fs"', () => {
  afterAll(() => {
    jest.unmock('fs');
  });

  afterEach(__reset__);

  describe('#exists()', () => {
    const tmp = path.join(path.sep, 'tmp', 'fs-test');

    test('is true if "PATH" exists', async () => {
      expect(await fs.exists(tmp)).toBe(true);
    });

    test('is false if "PATH" does not exist', async () => {
      expect(await fs.exists('does-not-exist.tmp')).toBe(false);
    });

    test('is true if regexp "PATH" exists within "DIR"', async () => {
      const result = await fs.exists(
        new RegExp(path.basename(tmp)),
        path.dirname(tmp)
      );

      expect(result).toBe(true);
    });

    test('is false if regexp "PATH" does not exist within "DIR"', async () => {
      const result = await fs.exists(
        new RegExp('does-not-exist.tmp'),
        path.dirname(tmp)
      );

      expect(result).toBe(false);
    });
  });

  describe('#rmrf()', () => {
    const tmp = path.join(path.sep, 'tmp', 'rmrf-test', 'data.txt');

    test('removes a file', async () => {
      await fs.rmrf(tmp);
      expect(await fs.exists(tmp)).toBe(false);
    });

    test('removes a directory and its contents', async () => {
      const target = path.dirname(tmp);

      await fs.rmrf(target);
      expect(await fs.exists(target)).toBe(false);
    });
  });

  describe('#parsePath()', () => {
    const parts = [
      path.sep,
      'test',
      'index.js',
    ];

    test('correctly parses a file path', () => {
      expect(fs.parsePath(...parts)).toEqual(
        expect.objectContaining({
          absolute: path.join(...parts),
          relative: path.join(...parts.slice(1)),
        })
      );
    });

    test('can be called with no arguments', () => {
      expect(fs.parsePath()).toEqual(
        expect.objectContaining({
          absolute: process.cwd(),
          relative: process.cwd(),
        })
      );
    });
  });

  describe('#isJSFile()', () => {
    const [a, b, c] = [
      'author.js',
      'author.rb',
      '.gitkeep'
    ];

    test('is true if a file has a `.js` extension', () => {
      expect(fs.isJSFile(a)).toBe(true);
    });

    test('is false if a file does not have a `.js` extension', () => {
      expect(fs.isJSFile(b)).toBe(false);
    });

    test('is false if the file is prefixed with `.`', () => {
      expect(fs.isJSFile(c)).toBe(false);
    });
  });

  describe('#mkdirRec()', () => {
    const tmp = path.join(path.sep, 'tmp', 'mkdir-rec-test', 'directory');

    test('creates a directory recursively', async () => {
      await fs.mkdirRec(tmp);
      expect(await fs.exists(tmp)).toBe(true);
    });

    test('does not throw when the directory already exists', async () => {
      await fs.mkdirRec(tmp);
      await fs.mkdirRec(tmp);
      expect(await fs.exists(tmp)).toBe(true);
    });

    test('properly rejects when a valid error occurs', async () => {
      await fs.mkdirRec(path.join(path.sep, 'tmp', 'throw')).catch(err => {
        expect(err).toBeInstanceOf(Error);
      });
    });
  });

  describe('#readdirRec()', () => {
    const tmp = path.join(path.sep, 'tmp', 'readdir-rec-test');

    test('recursively reads a directory', async () => {
      expect(await fs.readdirRec(tmp)).toMatchSnapshot();
    });
  });
});
