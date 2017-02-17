// @flow
export const mkdir = (
  jest.fn().mockImplementation((path, mode, cb) => {
    cb(null, undefined);
  })
);

export const rmdir = (
  jest.fn().mockImplementation((path, cb) => {
    cb(null, undefined);
  })
);

export const readdir = (
  jest.fn().mockImplementation((path, cb) => {
    cb(null, []);
  })
);

export const readFile = (
  jest.fn().mockImplementation((path, options, cb) => {
    cb(null, options.encoding ? '' : new Buffer(''));
  })
);

export const writeFile = (
  jest.fn().mockImplementation((path, data, options, cb) => {
    cb(null, undefined);
  })
);

export const appendFile = (
  jest.fn().mockImplementation((path, data, options, cb) => {
    cb(null, undefined);
  })
);

export const stat = (
  jest.fn().mockImplementation((path, cb) => {
    cb(null, {});
  })
);

export const unlink = (
  jest.fn().mockImplementation((path, cb) => {
    cb(null, undefined);
  })
);

export const watch = (
  jest.fn().mockImplementation((path, options, cb) => (
    () => cb('update', 'index.js')
  ))
);
