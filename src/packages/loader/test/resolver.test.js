// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import { getTestApp } from '../../../../test/utils/get-test-app';
import { closestChild, closestAncestor } from '../resolver';

describe('module "loader/resolver"', () => {
  describe('#closestChild()', () => {
    let serializers;

    before(async () => {
      const app = await getTestApp();

      serializers = app.serializers;
    });

    it('can find the closest child by a namespaced key suffix', () => {
      const result = closestChild(serializers, 'users');

      expect(result).to.be.ok;
    });
  });

  describe('#closestAncestor()', () => {
    let serializers;

    before(async () => {
      const app = await getTestApp();

      serializers = app.serializers;
    });

    it('can find the closest ancestor by a namespaced key', () => {
      const result = closestAncestor(serializers, 'admin/users');

      expect(result)
        .to.be.ok
        .and.have.deep.property('constructor.name', 'UsersSerializer');
    });
  });
});
