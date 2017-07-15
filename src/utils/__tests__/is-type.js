/* @flow */

import {
  isNil,
  isNull,
  isObject,
  isString,
  isUndefined,
} from '@lux/utils/is-type'

test('isNil()', () => {
  expect(isNil(0)).toBe(false)
  expect(isNil('')).toBe(false)
  expect(isNil(NaN)).toBe(false)

  expect(isNil(null)).toBe(true)
  expect(isNil(undefined)).toBe(true)
})

test('isNull()', () => {
  expect(isNull({})).toBe(false)
  expect(isNull(0)).toBe(false)
  expect(isNull('')).toBe(false)
  expect(isNull(NaN)).toBe(false)
  expect(isNull(undefined)).toBe(false)

  expect(isNull(null)).toBe(true)
})

test('isObject()', () => {
  class SomeObject {}

  expect(isObject(null)).toBe(false)
  expect(isObject([])).toBe(false)

  expect(isObject({})).toBe(true)
  expect(isObject(new SomeObject())).toBe(true)
  expect(isObject(Object.create(null))).toBe(true)
})

test('isString()', () => {
  expect(isString([])).toBe(false)

  expect(isString('')).toBe(true)
})

test('isUndefined()', () => {
  expect(isUndefined(0)).toBe(false)
  expect(isUndefined('')).toBe(false)
  expect(isUndefined(NaN)).toBe(false)
  expect(isUndefined(null)).toBe(false)

  expect(isUndefined()).toBe(true)
  expect(isUndefined(undefined)).toBe(true)
})
