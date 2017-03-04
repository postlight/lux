/* @flow */


import * as os from 'os';
import * as path from 'path';

jest.mock('os');

describe('module "fs/utils/create-path-remover"', () => {
  let createPathRemover;

  describe('#default()', () => {
    ['win32', 'linux', 'darwin'].forEach(platform => {
      describe(`- platform ${platform}`, () => {
        const file = 'index.js';
        let subject;
        let basePath;

        beforeAll(() => {
          // $FlowIgnore
          os.__setPlatform__(platform);

          if (platform === 'win32') {
            basePath = path.win32.join(path.win32.sep, 'tmp', 'test');
            subject = path.win32.join(basePath, file);
          } else {
            basePath = path.posix.join(path.posix.sep, 'tmp', 'test');
            subject = path.posix.join(basePath, file);
          }

          createPathRemover = require('../utils/create-path-remover').default;
        });

        afterAll(() => {
          jest.resetModules();
        });

        it('creates a path remover function', () => {
          const removePath = createPathRemover(basePath);

          expect(removePath(subject)).toEqual(file);
        });
      });
    });
  });
});
