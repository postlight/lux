// @flow
import { getTestApp } from '../../../../test/utils/get-test-app';
import createReplacer from '../utils/create-replacer';

describe('module "router"', () => {
  describe('util createReplacer()', () => {
    let subject;

    beforeAll(async () => {
      const app = await getTestApp();
      const healthController = app.controllers.get('health');
      const { constructor: HealthController } = healthController;

      class AdminHealthController extends HealthController {}

      subject = createReplacer(new Map([
        ['posts', app.controllers.get('posts')],
        ['health', healthController],
        ['admin/posts', app.controllers.get('admin/posts')],
        ['admin/health', new AdminHealthController({
          namespace: 'admin'
        })]
      ]));
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
