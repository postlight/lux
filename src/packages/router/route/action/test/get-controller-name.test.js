// @flow
import type { Request } from '../../../../request';
import getControllerName from '../utils/get-controller-name';
import { getTestApp } from '../../../../../../test/utils/get-test-app';

describe('module "router/route/action"', () => {
  describe('util getControllerName()', () => {
    let subject: Request;

    beforeAll(async () => {
      const { router } = await getTestApp();

      subject = {
        route: router.get('GET:/posts')
      };
    });

    it('returns the correct controller name', () => {
      const result = getControllerName(subject);

      expect(result).toBe('PostsController');
    });
  });
});
