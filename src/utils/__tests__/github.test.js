/* @flow */



import * as github from '../github';

describe('util github', () => {
  describe('#fileLink()', () => {
    const baseURL = 'https://github.com/postlight/lux/blob';

    describe('- without options', () => {
      it('builds the correct url', () => {
        const result = github.fileLink('src/index.js');

        expect(result).toBe(`${baseURL}/master/src/index.js`);
      });
    });

    describe('- with `branch` option', () => {
      it('builds the correct url', () => {
        const result = github.fileLink('src/index.js', {
          branch: 'branch-name'
        });

        expect(result).toBe(`${baseURL}/branch-name/src/index.js`);
      });
    });

    describe('- with `line` option', () => {
      it('builds the correct url', () => {
        const result = github.fileLink('src/index.js', {
          line: 2
        });

        expect(result).toBe(`${baseURL}/master/src/index.js#2`);
      });

      it('ignores line if it is > 0', () => {
        const result = github.fileLink('src/index.js', {
          line: -10
        });

        expect(result).toBe(`${baseURL}/master/src/index.js`);
      });
    });
  });
});
