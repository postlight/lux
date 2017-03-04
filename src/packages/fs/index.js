/* @flow */

import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line
import type { Stats } from 'fs';

import promisify from '../../utils/promisify';

import Watcher from './watcher';
import createPathRemover from './utils/create-path-remover';

export { default as rmrf } from './utils/rmrf';
export { default as exists } from './utils/exists';
export { default as isJSFile } from './utils/is-js-file';
export { default as parsePath } from './utils/parse-path';

/**
 * @private
 */
export const stat: (path: string) => Promise<Stats> = (
  promisify(fs.stat)
);

/**
 * @private
 */
export const mkdir: (path: string, mode?: number) => Promise<void> = (
  promisify(fs.mkdir)
);

/**
 * @private
 */
export const rmdir: (path: string) => Promise<void> = (
  promisify(fs.rmdir)
);

/**
 * @private
 */
export const unlink: (path: string) => Promise<void> = (
  promisify(fs.unlink)
);

/**
 * @private
 */
export const readdir: (path: string) => Promise<Array<string>> = (
  promisify(fs.readdir)
);

/**
 * @private
 */
export const readFile: (path: string) => Promise<Buffer> = (
  promisify(fs.readFile)
);

/**
 * @private
 */
export const writeFile: (path: string, data: Buffer) => Promise<void> = (
  promisify(fs.writeFile)
);

/**
 * @private
 */
export const appendFile: (path: string, data: Buffer) => Promise<void> = (
  promisify(fs.appendFile)
);

/**
 * @private
 */
export function watch(watchPath: string): Promise<Watcher> {
  return new Watcher(watchPath);
}

/**
 * @private
 */
export function mkdirRec(dirPath: string, mode: number = 511): Promise<void> {
  const parent = path.resolve(dirPath, '..');

  return stat(parent)
    .catch(() => mkdirRec(parent, mode))
    .then(() => mkdir(dirPath, mode))
    .catch(err => {
      if (err.code !== 'EEXIST') {
        return Promise.reject(err);
      }
      return Promise.resolve();
    });
}

/**
 * @private
 */
export function readdirRec(dirPath: string): Promise<Array<string>> {
  const stripPath = createPathRemover(dirPath);

  return readdir(dirPath)
    .then(files => Promise.all(
      files.map(file => {
        const filePath = path.join(dirPath, file);

        return Promise.all([filePath, stat(filePath)]);
      })
    ))
    .then(files => Promise.all(
      files.map(([file, stats]) => Promise.all([
        file,
        stats.isDirectory() ? readdirRec(file) : []
      ]))
    ))
    .then(files => files.reduce((arr, [file, children]) => {
      const basename = stripPath(file);

      return [
        ...arr,
        basename,
        ...children.map(child => path.join(basename, stripPath(child)))
      ];
    }, []));
}
