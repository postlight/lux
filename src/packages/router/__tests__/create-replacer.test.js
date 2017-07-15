/* @flow */

import Controller from '@lux/packages/controller'
import createReplacer from '../utils/create-replacer'

describe('module "router"', () => {
  describe('util createReplacer()', () => {
    let subject

    beforeAll(async () => {
      class PostsController extends Controller {}
      class HealthController extends Controller {}
      class AdminPostsController extends PostsController {}
      class AdminHealthController extends HealthController {}

      subject = createReplacer(
        new Map([
          ['posts', new PostsController()],
          ['health', new HealthController()],
          [
            'admin/posts',
            new AdminPostsController({
              namespace: 'admin',
            }),
          ],
          [
            'admin/health',
            new AdminHealthController({
              namespace: 'admin',
            }),
          ],
        ]),
      )
    })

    test('returns an instance of RegExp', () => {
      expect(subject instanceof RegExp).toBe(true)
    })

    test('correctly replaces dynamic parts', () => {
      expect('posts/1'.replace(subject, '$1/:dynamic')).toBe('posts/:dynamic')

      expect('health/1'.replace(subject, '$1/:dynamic')).toBe('health/:dynamic')
    })
  })
})
