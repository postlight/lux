/* @flow */

import * as env from '../env'
import setEnv from '../../../test/utils/set-env'

afterEach(() => {
  setEnv('test')
})

test('isDevelopment()', () => {
  setEnv('development')
  expect(env.isDevelopment()).toBe(true)
})

test('isProduction()', () => {
  setEnv('production')
  expect(env.isProduction()).toBe(true)
})

test('isTest()', () => {
  expect(env.isTest()).toBe(true)
})
