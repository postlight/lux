/* @flow */

import * as stringify from '../stringify'

const DEFAULT = 'default'
const CIRCULAR = 'circular'

describe('util fn()', () => {
  ;[DEFAULT, CIRCULAR].forEach(method => {
    describe(`- ${method}`, () => {
      const fn = stringify[method]

      test('converts arrays to a string', () => {
        expect(fn([1, 2, 3])).toMatchSnapshot()
      })

      test('converts booleans to a string', () => {
        expect(fn(true)).toBe('true')
        expect(fn(false)).toBe('false')
      })

      test('converts null to a string', () => {
        expect(fn(null)).toBe('null')
      })

      test('converts numbers to a string', () => {
        expect(fn(1)).toBe('1')
        expect(fn(NaN)).toBe('NaN')
        expect(fn(Infinity)).toBe('Infinity')
      })

      test('converts objects to a string', () => {
        expect(fn({ a: 1, b: 2, c: 3 })).toMatchSnapshot()
      })

      if (method === CIRCULAR) {
        test('converts circular objects to a string', () => {
          const subject = { a: 1, b: 2, c: {} }

          subject.c = subject

          expect(fn(subject)).toMatchSnapshot()
        })
      }

      test('converts strings to a string', () => {
        expect(fn('Test')).toBe('Test')
      })

      test('converts undefined to a string', () => {
        expect(fn(undefined)).toBe('undefined')
      })
    })
  })
})
