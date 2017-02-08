// @flow


import { isJSFile } from '../index';

describe('module "fs"', () => {
  describe('#isJSFile()', () => {
    const [a, b, c] = [
      'author.js',
      'author.rb',
      '.gitkeep'
    ];

    it('is true if a file has a `.js` extension', () => {
      expect(isJSFile(a)).toBe(true);
    });

    it('is false if a file does not have a `.js` extension', () => {
      expect(isJSFile(b)).toBe(false);
    });

    it('is false if the file is prefixed with `.`', () => {
      expect(isJSFile(c)).toBe(false);
    });
  });
});
