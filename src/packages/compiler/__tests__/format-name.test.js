/* @flow */

import formatName from '../utils/format-name';

const KEYS = [
  'actions',
  'application',
  'categorizations',
  'comments',
  'custom',
  'friendships',
  'health',
  'images',
  'notifications',
  'posts',
  'reactions',
  'tags',
  'users',
  'admin/actions',
  'admin/application',
  'admin/categorizations',
  'admin/comments',
  'admin/friendships',
  'admin/images',
  'admin/notifications',
  'admin/posts',
  'admin/reactions',
  'admin/tags',
  'admin/users',
];

describe('module "compiler"', () => {
  describe('util formatName()', () => {
    it('transforms an array of keys into identifiers', () => {
      expect(KEYS.map(formatName)).toMatchSnapshot();
    });
  });
});
