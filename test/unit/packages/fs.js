import { expect } from 'chai';

import isJsFile from '../../../src/packages/fs/utils/is-js-file';

describe('Unit: class Fs ', () => {
  describe('Unit: util isJsFile', () => {
    const subject = {
      a: 'author.js',
      b: '.gitkeep',
      c: 'author.js~'
    };

    it('is a JavaScript file', () => {
      const result = isJsFile(subject.a);

      expect(result).to.be.a('boolean');
      expect(result).to.equal(true);
    });

    it('filter out hidden files', () => {
      const result = isJsFile(subject.b);

      expect(result).to.be.a('boolean');
      expect(result).to.equal(false);
    });

    it('filter out non JavaScript files', () => {
      const result = isJsFile(subject.c);

      expect(result).to.be.a('boolean');
      expect(result).to.equal(false);
    });
  });
});
