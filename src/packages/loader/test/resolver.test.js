// @flow
import { getTestApp } from '../../../../test/utils/get-test-app';
import { closestChild, closestAncestor } from '../resolver';

describe('module "loader/resolver"', () => {
  let serializers;

  beforeAll(async () => {
    serializers = await getTestApp().then(app => app.serializers);
  });

  describe('#closestChild()', () => {
    it('can find the closest child by a namespaced key suffix', () => {
      expect(() => closestChild(serializers, 'users')).not.toThrow();
    });
  });

  describe('#closestAncestor()', () => {
    it('can find the closest ancestor by a namespaced key', () => {
      expect(() => closestAncestor(serializers, 'admin/users')).not.toThrow();
    });
  });
});
