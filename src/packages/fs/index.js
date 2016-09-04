// @flow
import fs from 'fs';
import { join as joinPath, resolve as resolvePath } from 'path';

import createResolver from './utils/create-resolver';
import createPathRemover from './utils/create-path-remover';

import type { Stats } from 'fs';

import type { fs$readOpts, fs$writeOpts } from './interfaces';

export { default as rmrf } from './utils/rmrf';
export { default as exists } from './utils/exists';
export { default as isJSFile } from './utils/is-js-file';
export { default as parsePath } from './utils/parse-path';

export type { fs$ParsedPath } from './interfaces';

/**
 * @private
 */
export const { watch } = fs;

/**
 * @private
 */
export function mkdir(path: string, mode: number = 511) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, mode, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function mkdirRec(path: string, mode: number = 511): Promise<void> {
  const parent = resolvePath(path, '..');

  return stat(parent)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return mkdirRec(parent, mode);
      } else {
        return Promise.reject(err);
      }
    })
    .then(() => mkdir(path, mode))
    .catch(err => {
      if (err.code !== 'EEXIST') {
        return Promise.reject(err);
      }
    });
}

/**
 * @private
 */
export function rmdir(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function readdir(path: string): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fs.readdir(path, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function readdirRec(
  path: string,
  opts?: fs$readOpts
): Promise<Array<string>> {
  const stripPath = createPathRemover(path);

  return readdir(path, opts)
    .then(files => Promise.all(
      files.map(file => {
        file = joinPath(path, file);

        return Promise.all([file, stat(file)]);
      })
    ))
    .then(files => Promise.all(
      files.map(([file, stats]) => Promise.all([
        file,
        stats.isDirectory() ? readdirRec(file) : []
      ]))
    ))
    .then(files => files.reduce((arr, [file, children]) => {
      file = stripPath(file);

      return [
        ...arr,
        file,
        ...children.map(child => joinPath(file, stripPath(child)))
      ];
    }, []));
}

/**
 * @private
 */
export function readFile(
  path: string,
  opts?: fs$readOpts
): Promise<string | Buffer> {
  return new Promise((resolve, reject) => {
    if (typeof opts !== 'object') {
      opts = {};
    }

    fs.readFile(path, opts, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function writeFile(
  path: string,
  data: string | Buffer,
  opts?: fs$writeOpts
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function appendFile(
  path: string,
  data: string | Buffer,
  opts?: fs$writeOpts
) {
  return new Promise((resolve, reject) => {
    if (typeof opts !== 'object') {
      opts = {};
    }

    fs.appendFile(path, data, opts, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function stat(path: string): Promise<Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(path, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function unlink(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(path, createResolver(resolve, reject));
  });
}
