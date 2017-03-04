/* @flow */

import getDynamicSegments from '../utils/get-dynamic-segments';

describe('module "router/route"', () => {
  describe('util getDynamicSegments()', () => {
    it('parses the dynamic segments in a path', () => {
      expect(getDynamicSegments('/posts/:pid/comments/:cid')).toEqual([
        'pid',
        'cid',
      ]);
    });

    it('does not parse static segments in a path', () => {
      expect(getDynamicSegments('/posts')).toHaveLength(0);
    });

    it('handles paths containing a trailing forward-slash', () => {
      const path = '/posts/:pid/comments/:cid';

      expect(getDynamicSegments(path)).toEqual(getDynamicSegments(`${path}/`));
    });
  });
});
