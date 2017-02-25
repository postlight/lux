// @flow
import { getTestApp } from '../../../../test/utils/test-app';
import createReplacer from '../utils/create-replacer';

describe('module "router"', () => {
  describe('util createReplacer()', () => {
    let app;
    let subject;

    beforeAll(async () => {
      app = await getTestApp();

      const healthController = app.controllers.get('health');
      // $FlowIgnore
      const { constructor: HealthController } = healthController;

      class AdminHealthController extends HealthController {}

      subject = createReplacer(new Map([
        // $FlowIgnore
        ['posts', app.controllers.get('posts')],
        // $FlowIgnore
        ['health', healthController],
        // $FlowIgnore
        ['admin/posts', app.controllers.get('admin/posts')],
        ['admin/health', new AdminHealthController({
          namespace: 'admin'
        })]
      ]));
    });

    afterAll(async () => {
      await app.destroy();
    });

    it('returns an instance of RegExp', () => {
      expect(subject instanceof RegExp).toBe(true);
    });

    it('correctly replaces dynamic parts', () => {
      expect(
        'posts/1'.replace(subject, '$1/:dynamic')
      ).toBe('posts/:dynamic');

      expect(
        'health/1'.replace(subject, '$1/:dynamic')
      ).toBe('health/:dynamic');
    });
  });
});
