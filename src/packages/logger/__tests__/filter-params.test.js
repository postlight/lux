/* @flow */

import filterParams from '../request-logger/utils/filter-params'

describe('module "logger"', () => {
  describe('util filterParams()', () => {
    const params = {
      id: 1,
      username: 'test',
      password: 'test',
    }

    const filter = ['username', 'password']

    test('replaces the value of filtered params', () => {
      expect(filterParams(params, ...filter)).toMatchSnapshot()
    })

    test('leaves non-filtered params unchanged', () => {
      expect(filterParams(params, ...filter)).toMatchSnapshot()
    })

    test('handles nested parameters', () => {
      expect(filterParams({ params }, ...filter)).toMatchSnapshot()
    })
  })
})
