/* @flow */

import * as query from '../utils/query'

describe('module "adapters/query"', () => {
  describe('#camelize()', () => {
    test('works with spaces', () => {
      expect(query.camelize('test camelize')).toBe('testCamelize')
    })

    test('works with dashes', () => {
      expect(query.camelize('test-camelize')).toBe('testCamelize')
    })

    test('works with underscores', () => {
      expect(query.camelize('test_camelize')).toBe('testCamelize')
    })

    test('works with an empty string', () => {
      expect(query.camelize('')).toBe('')
    })
  })

  describe('#fromObject()', () => {
    test('coerces types from strings', () => {
      const result = query.fromObject({
        num: '100',
        csv: '1,2,3',
        date: new Date().toISOString(),
        null: 'null',
        true: 'true',
        false: 'false',
        string: 'test',
      })

      expect(result).toEqual({
        num: 100,
        csv: [1, 2, 3],
        date: expect.any(Date),
        null: null,
        true: true,
        false: false,
        string: 'test',
      })
    })

    test('can convert objects recursively', () => {
      const result = query.fromObject({
        data: {
          num: '100',
          csv: '1,2,3',
          date: new Date().toISOString(),
          null: 'null',
          true: 'true',
          false: 'false',
          string: 'test',
        },
      })

      expect(result).toEqual({
        data: {
          num: 100,
          csv: [1, 2, 3],
          date: expect.any(Date),
          null: null,
          true: true,
          false: false,
          string: 'test',
        },
      })
    })

    test('always coerces `include` to an array', () => {
      ;[
        { include: '1' },
        { include: '1,2,3' },
        { include: 'test-include,include-test' },
      ].forEach(item => {
        expect(query.fromObject(item)).toMatchSnapshot()
      })
    })

    test('always coerces `fields` to an object containing arrays', () => {
      const result = query.fromObject({
        fields: {
          posts: 'id,title,body,2',
          users: 'id,name,email',
          comments: 'id,message',
        },
      })

      expect(result).toMatchSnapshot()
    })
  })
})
