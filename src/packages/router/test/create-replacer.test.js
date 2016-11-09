// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import { getTestApp } from '../../../../test/utils/get-test-app';
import createReplacer from '../utils/create-replacer';

describe('module "router"', () => {
  describe('util createReplacer()', () => {
    let subject;

    before(async () => {
      const app = await getTestApp();
      // $FlowIgnore
      const healthController = app.controllers.get('health');
      const { constructor: HealthController } = healthController;

      class AdminHealthController extends HealthController {}

      subject = createReplacer(new Map([
        // $FlowIgnore
        ['posts', app.controllers.get('posts')],
        ['health', healthController],
        // $FlowIgnore
        ['admin/posts', app.controllers.get('admin/posts')],
        ['admin/health', new AdminHealthController({
          namespace: 'admin'
        })]
      ]));
    });

    it('returns an instance of RegExp', () => {
      expect(subject).to.be.an.instanceOf(RegExp);
    });

    it('correctly replaces dynamic parts', () => {
      expect(
        'posts/1'.replace(subject, '$1/:dynamic')
      ).to.equal('posts/:dynamic');

      expect(
        'health/1'.replace(subject, '$1/:dynamic')
      ).to.equal('health/:dynamic');
    });
  });
});
