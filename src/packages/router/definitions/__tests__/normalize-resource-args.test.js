/* @flow */

import { BUILT_IN_ACTIONS } from '@lux/packages/controller'
import normalizeResourceArgs from '../context/utils/normalize-resource-args'

describe('module "router/definitions/context"', () => {
  describe('util normalizeResourceArgs()', () => {
    test('normalizes arguments with a name only', () => {
      const result = normalizeResourceArgs(['posts'])

      expect(result).toEqual(
        expect.arrayContaining([
          {
            name: 'posts',
            path: '/posts',
            only: BUILT_IN_ACTIONS,
          },
          expect.any(Function),
        ]),
      )
    })

    test('normalizes arguments with a name and options', () => {
      const result = normalizeResourceArgs([
        'posts',
        {
          only: ['show', 'index'],
        },
      ])

      expect(result).toEqual(
        expect.arrayContaining([
          {
            name: 'posts',
            path: '/posts',
            only: ['show', 'index'],
          },
          expect.any(Function),
        ]),
      )
    })

    test('normalizes arguments with a name and builder', () => {
      const result = normalizeResourceArgs([
        'posts',
        function build() {
          return undefined
        },
      ])

      expect(result).toEqual(
        expect.arrayContaining([
          {
            name: 'posts',
            path: '/posts',
            only: BUILT_IN_ACTIONS,
          },
          expect.any(Function),
        ]),
      )
    })

    test('normalizes arguments with a name, options, and builder', () => {
      const result = normalizeResourceArgs([
        'posts',
        {
          only: ['show', 'index'],
        },
        function build() {
          return undefined
        },
      ])

      expect(result).toEqual(
        expect.arrayContaining([
          {
            name: 'posts',
            path: '/posts',
            only: ['show', 'index'],
          },
          expect.any(Function),
        ]),
      )
    })
  })
})
