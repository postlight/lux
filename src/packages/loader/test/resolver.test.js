// @flow


import { getTestApp } from '../../../../test/utils/get-test-app';
import { closestChild, closestAncestor } from '../resolver';

describe('module "loader/resolver"', () => {
  describe('#closestChild()', () => {
    let serializers;

    beforeAll(async () => {
      const app = await getTestApp();

      serializers = app.serializers;
    });

    it('can find the closest child by a namespaced key suffix', () => {
      const result = closestChild(serializers, 'users');

      expect(result).not.toThrow();
    });
  });

  describe('#closestAncestor()', () => {
    let serializers;

    beforeAll(async () => {
      const app = await getTestApp();

      serializers = app.serializers;
    });

    it('can find the closest ancestor by a namespaced key', () => {
      const result = closestAncestor(serializers, 'admin/users');

      expect(result).not.toThrow();
      expect(result).toEqual(
        expect.objectContaining({
          constructor: expect.objectContaining({
            name: 'UsersSerializer',
          }),
        })
      );
    });
  });
});
