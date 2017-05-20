/* @flow */

import * as path from 'path'

import isExternal from '../utils/is-external'

const SRC = path.join(__dirname, '..', '..', '..')

describe('module "compiler"', () => {
  describe('util isExternal()', () => {
    test('returns a function that accepts a single argument', () => {
      expect(isExternal(SRC)).toEqual(expect.any(Function))
    })

    describe('external()', () => {
      let external: (id: string) => boolean

      beforeEach(() => {
        external = isExternal(SRC)
      })

      test('returns `true` for external modules', () => {
        expect(external('knex')).toBe(true)
      })

      test('returns `false` for aliased file paths', () => {
        expect(external('app/models/user')).toBe(false)
      })

      test('returns `false` for absolute file paths', () => {
        expect(external('/absolute/path/to/app/models/user')).toBe(false)
        expect(external('C:/absolute/path/to/app/models/user')).toBe(false)
        expect(external(
          'C:\\absolute\\path\\to\\app\\models\\user'
        )).toBe(false)
      })

      test('returns `false` for relative file paths', () => {
        expect(external('./app/models/user')).toBe(false)
      })

      test('returns `false` for "LUX_LOCAL"', () => {
        expect(external('LUX_LOCAL')).toBe(false)
      })

      test('returns `false` for "lux-framework"', () => {
        expect(external('lux-framework')).toBe(false)
      })

      test('returns `false` for "babelHelpers"', () => {
        expect(external('babelHelpers')).toBe(false)
      })
    })
  })
})
