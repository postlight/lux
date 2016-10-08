// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import type { Request } from '../../../../server';
import setType from '../../../../../utils/set-type';
import getActionName from '../utils/get-action-name';
import { getTestApp } from '../../../../../../test/utils/get-test-app';

describe('module "router/route/action"', () => {
  describe('util getActionName()', () => {
    let subject: Request;

    before(async () => {
      const { router } = await getTestApp();

      subject = setType(() => {
        return {
          route: router.get('GET:/posts')
        };
      });
    });

    it('returns the correct action name', () => {
      const result = getActionName(subject);

      expect(result).to.equal('index');
    });
  });
});
