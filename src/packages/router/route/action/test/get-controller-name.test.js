// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import type { Request } from '../../../../server';
import setType from '../../../../../utils/set-type';
import getControllerName from '../utils/get-controller-name';
import { getTestApp } from '../../../../../../test/utils/get-test-app';

describe('module "router/route/action"', () => {
  describe('util getControllerName()', () => {
    let subject: Request;

    before(async () => {
      const { router } = await getTestApp();

      subject = setType(() => {
        return {
          route: router.get('GET:/posts')
        };
      });
    });

    it('returns the correct controller name', () => {
      const result = getControllerName(subject);

      expect(result).to.equal('PostsController');
    });
  });
});
