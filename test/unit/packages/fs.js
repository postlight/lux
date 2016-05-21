import { expect } from 'chai';

import isJSFile from '../../../src/packages/fs/utils/is-js-file';

describe('Unit: class fs ', () => {
  describe('Unit: util isJSFile', () => {
    const subject = {
      a: 'author.js',
      b: '.gitkeep',
      c: 'author.js~'
    };

    it('is a JavaScript file', () => {
      const result = isJSFile(subject.a);

      expect(result).to.be.a('boolean');
      expect(result).to.equal(true);
    });

    it('filter out hidden files', () => {
      const result = isJSFile(subject.b);

      expect(result).to.be.a('boolean');
      expect(result).to.equal(false);
    });

    it('filter out non JavaScript files', () => {
      const result = isJSFile(subject.c);

      expect(result).to.be.a('boolean');
      expect(result).to.equal(false);
    });
  });
});
