/* @flow */

import { FreezeableMap } from '@lux/packages/freezeable'
import sortByNamespace from '../utils/sort-by-namespace'

describe('module "loader/builder"', () => {
  describe('util sortByNamespace()', () => {
    test('returns -1 if "root" is the first argument', () => {
      const result = sortByNamespace(
        ['root', new FreezeableMap()],
        ['api', new FreezeableMap()],
      )

      expect(result).toBe(-1)
    })

    test('returns 1 if "root" is the second argument', () => {
      const result = sortByNamespace(
        ['api', new FreezeableMap()],
        ['root', new FreezeableMap()],
      )

      expect(result).toBe(1)
    })

    test('returns -1 if the first argument is shorter than the second', () => {
      const result = sortByNamespace(
        ['api', new FreezeableMap()],
        ['admin', new FreezeableMap()],
      )

      expect(result).toBe(-1)
    })

    test('returns 1 if the first argument is longer than the second', () => {
      const result = sortByNamespace(
        ['admin', new FreezeableMap()],
        ['api', new FreezeableMap()],
      )

      expect(result).toBe(1)
    })
  })
})
