import fs from 'fs';

import createResolver from './utils/create-resolver';

import type { fs$readOpts, fs$writeOpts } from './interfaces';

export { default as rmrf } from './utils/rmrf';
export { default as exists } from './utils/exists';
export { default as isJSFile } from './utils/is-js-file';

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
export function rmdir(path: string) {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function readdir(path: string, opts?: fs$readOpts) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, opts, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function readFile(path: string, opts?: fs$readOpts) {
  return new Promise((resolve, reject) => {
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
) {
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
    fs.appendFile(path, data, opts, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function stat(path: string) {
  return new Promise((resolve, reject) => {
    fs.stat(path, createResolver(resolve, reject));
  });
}

/**
 * @private
 */
export function unlink(path: string) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, createResolver(resolve, reject));
  });
}
