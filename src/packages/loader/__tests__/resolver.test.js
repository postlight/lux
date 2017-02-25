// @flow
import { getTestApp } from '../../../../test/utils/test-app';
import { closestChild, closestAncestor } from '../resolver';

describe('module "loader/resolver"', () => {
  let app;
  let serializers;

  beforeAll(async () => {
    app = await getTestApp();
    ({ serializers } = app);
  });

  afterAll(async () => {
    await app.destroy();
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
