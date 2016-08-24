// @flow

import { expect } from 'chai';
import { it, describe } from 'mocha';

import getDynamicSegments from '../utils/get-dynamic-segments';

describe('Route', () => {
  describe('#getDynamicSegments()', () => {
    it('parses the dynamic segments in a path', () => {
      const segments = getDynamicSegments('/posts/:pid/comments/:cid');
      expect(segments).to.deep.equal(['pid', 'cid']);
    });

    it('does not parse static segments in a path', () => {
      const segments = getDynamicSegments('/posts');
      expect(segments).to.be.empty;
    });

    it('handles paths containing a trailing forward-slash', () => {
      const path = '/posts/:pid/comments/:cid';
      const segments = getDynamicSegments(path);
      const segmentsWithTrailingSlash = getDynamicSegments(path + '/');
      expect(segments).to.deep.equal(segmentsWithTrailingSlash);
    });
  });
});
