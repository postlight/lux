/* @flow */

import getDynamicSegments from '../utils/get-dynamic-segments'

describe('module "router/route"', () => {
  describe('util getDynamicSegments()', () => {
    test('parses the dynamic segments in a path', () => {
      expect(getDynamicSegments('/posts/:pid/comments/:cid')).toEqual([
        'pid',
        'cid',
      ])
    })

    test('does not parse static segments in a path', () => {
      expect(getDynamicSegments('/posts')).toHaveLength(0)
    })

    test('handles paths containing a trailing forward-slash', () => {
      const path = '/posts/:pid/comments/:cid'

      expect(getDynamicSegments(path)).toEqual(getDynamicSegments(`${path}/`))
    })
  })
})
