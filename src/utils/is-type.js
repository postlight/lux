/* @flow */

export const isInstance = <T>(lhs: mixed, rhs: Class<T>): boolean %checks =>
  lhs instanceof rhs

export const isFunction = (value: mixed): boolean %checks =>
  typeof value === 'function'

export const isNil = (value: mixed): boolean %checks =>
  isUndefined(value) || isNull(value)

export const isNull = (value: mixed): boolean %checks => value === null

export const isObject = (value: mixed): boolean %checks =>
  !isNull(value) && typeof value === 'object' && !Array.isArray(value)

export const isString = (value: mixed): boolean %checks =>
  typeof value === 'string'

export const isUndefined = (value: mixed): boolean %checks =>
  value === undefined
