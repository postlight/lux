/* @flow */

import * as diff from '../diff'

describe('util diff', () => {
  describe('.map()', () => {
    test('returns a map containing the difference between two maps', () => {
      const result = diff.map(
        new Map([
          ['x', 1]
        ]),
        new Map([
          ['x', 1],
          ['y', 2]
        ])
      )

      expect(result instanceof Map).toBe(true)
      expect([...result]).toEqual([
        ['y', 2]
      ])
    })
  })
})
