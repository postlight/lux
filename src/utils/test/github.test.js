// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import * as github from '../github';

describe('util github', () => {
  describe('#fileLink()', () => {
    const baseURL = 'https://github.com/postlight/lux/blob';

    describe('- without options', () => {
      it('builds the correct url', () => {
        const result = github.fileLink('src/index.js');

        expect(result).to.equal(`${baseURL}/master/src/index.js`);
      });
    });

    describe('- with `branch` option', () => {
      it('builds the correct url', () => {
        const result = github.fileLink('src/index.js', {
          branch: 'branch-name'
        });

        expect(result).to.equal(`${baseURL}/branch-name/src/packages/index.js`);
      });
    });

    describe('- with `line` option', () => {
      it('builds the correct url', () => {
        const result = github.fileLink('src/index.js', {
          line: 2
        });

        expect(result).to.equal(`${baseURL}/master/src/packages/index.js#2`);
      });

      it('ignores line if it is not a number', () => {
        const result = github.fileLink('src/index.js', {
          // $FlowIgnore
          line: [1, 2, 3]
        });

        expect(result).to.equal(`${baseURL}/master/src/packages/index.js`);
      });

      it('ignores line if it is > 0', () => {
        const result = github.fileLink('src/index.js', {
          line: -10
        });

        expect(result).to.equal(`${baseURL}/master/src/packages/index.js`);
      });
    });
  });
});
