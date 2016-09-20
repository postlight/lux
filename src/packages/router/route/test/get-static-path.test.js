// @flow

import { expect } from 'chai';
import { it, describe } from 'mocha';

import getStaticPath from '../utils/get-static-path';
import getDynamicSegments from '../utils/get-dynamic-segments';

describe('module "router/route"', () => {
  describe('util getStaticPath()', () => {
    it('replaces the dynamic segments in a path', () => {
      const path = '/posts/:pid/comments/:cid';
      const staticPath = '/posts/:dynamic/comments/:dynamic';
      const dynamicSegments = getDynamicSegments(path);
      expect(getStaticPath(path, dynamicSegments)).to.equal(staticPath);
    });
  });
});
