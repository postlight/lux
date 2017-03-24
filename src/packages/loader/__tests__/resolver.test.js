/* @flow */

import * as path from 'path';

import { createLoader } from '../index';
import { closestChild, closestAncestor } from '../resolver';

const APP_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'test',
  'test-app',
);

describe('module "loader/resolver"', () => {
  let load;

  beforeAll(async () => {
    load = createLoader(APP_PATH);
  });

  describe('#closestChild()', () => {
    it('can find the closest child by a namespaced key suffix', () => {
      const serializers = load('serializers');

      expect(() => closestChild(serializers, 'users')).not.toThrow();
    });
  });

  describe('#closestAncestor()', () => {
    it('can find the closest ancestor by a namespaced key', () => {
      const serializers = load('serializers');

      expect(() => closestAncestor(serializers, 'admin/users')).not.toThrow();
    });
  });
});
