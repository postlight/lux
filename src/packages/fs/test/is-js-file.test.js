// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { isJSFile } from '../index';

describe('fs', () => {
  describe('#isJSFile()', () => {
    const [a, b, c] = [
      'author.js',
      'author.rb',
      '.gitkeep'
    ];

    it('is true if a file has a `.js` extension', () => {
      expect(isJSFile(a)).to.be.true;
    });

    it('is false if a file does not have a `.js` extension', () => {
      expect(isJSFile(b)).to.be.false;
    });

    it('is false if the file is prefixed with `.`', () => {
      expect(isJSFile(c)).to.be.false;
    });
  });
});
