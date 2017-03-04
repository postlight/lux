/* @flow */


import * as path from 'path';

let ROOT;

const flatten = parts => (
  parts
    .reduce((arr, part) => arr.concat(part.split(path.sep)), [])
    .filter(Boolean)
);

const walk = (dir, ...parts) => {
  if (dir instanceof Map) {
    const keys = flatten(parts);

    if (keys.length === 1) {
      return dir.get(keys[0]);
    }

    return walk(dir.get(keys[0]), ...keys.slice(1));
  }

  return dir;
};

export const __reset__ = () => {
  ROOT = new Map([
    ['tmp', new Map([
      ['fs-test', Buffer.from('test')],
      ['rmrf-test', new Map([
        ['data.txt', Buffer.from('test')],
      ])],
      ['readdir-rec-test', new Map([
        ['directory', new Map([
          ['x.txt', Buffer.from('x')],
          ['y.txt', Buffer.from('y')],
          ['z.txt', Buffer.from('z')],
        ])],
      ])],
    ])],
  ]);
};

export const mkdir = (
  jest.fn().mockImplementation((...args) => {
    const [key, , cb] = args;

    if (key.endsWith('throw')) {
      cb(new Error());
      return;
    }

    const dir = walk(ROOT, path.dirname(key));

    if (dir instanceof Map) {
      const name = path.basename(key);

      if (dir.has(name)) {
        // $FlowIgnore
        const err = Object.assign(new Error(), {
          code: 'EEXIST',
        });

        cb(err);
        return;
      }

      dir.set(name, new Map());
    }

    cb(null, undefined);
  })
);

export const rmdir = (
  jest.fn().mockImplementation((...args) => {
    const [key, cb] = args;
    const dir = walk(ROOT, path.dirname(key));

    if (dir instanceof Map) {
      dir.delete(path.basename(key));
    }

    cb(null, undefined);
  })
);

export const readdir = (
  jest.fn().mockImplementation((...args) => {
    const [dirPath, cb] = args;
    const result = walk(ROOT, dirPath);

    if (result instanceof Map) {
      cb(null, [...result.keys()]);
      return;
    }

    cb(null, []);
  })
);

export const readFile = (
  jest.fn().mockImplementation((...args) => {
    const [, options, cb] = args;

    cb(null, options.encoding ? '' : new Buffer(''));
  })
);

export const writeFile = (
  jest.fn().mockImplementation((...args) => {
    const [, , , cb] = args;

    cb(null, undefined);
  })
);

export const appendFile = (
  jest.fn().mockImplementation((...args) => {
    const [, , , cb] = args;

    cb(null, undefined);
  })
);

export const stat = (
  jest.fn().mockImplementation((...args) => {
    const [key, cb] = args;
    const result = walk(ROOT, key);

    if (result) {
      const isDirectory = () => result instanceof Map;
      const isFile = () => !isDirectory();

      cb(null, { isFile, isDirectory });
      return;
    }

    // $FlowIgnore
    const err = Object.assign(new Error(), {
      code: 'ENOENT',
    });

    cb(err);
  })
);

export const unlink = (
  jest.fn().mockImplementation((...args) => {
    const [key, cb] = args;
    const dir = walk(ROOT, path.dirname(key));

    if (dir instanceof Map) {
      dir.delete(path.basename(key));
    }

    cb(null, undefined);
  })
);

export const watch = (
  jest.fn().mockImplementation((...args) => {
    const [, , cb] = args;

    return () => cb('update', 'index.js');
  })
);

__reset__();
