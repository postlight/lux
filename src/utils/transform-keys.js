/* @flow */

import { camelize, dasherize } from 'inflection'

import entries from './entries'
import underscore from './underscore'

/**
 * @private
 */
export function transformKeys<T: Object | Array<mixed>>(
  source: T,
  transformer: (key: string) => string,
  deep: boolean = false
): T {
  const sourceType = typeof source

  if (Array.isArray(source)) {
    return source.slice(0)
  } else if (source && sourceType === 'object') {
    // $FlowIgnore
    return entries(source).reduce((result, [key, value]) => {
      const recurse = (
        deep
        && value
        && typeof value === 'object'
        && !Array.isArray(value)
        && !(value instanceof Date)
      )

      // eslint-disable-next-line no-param-reassign
      result[transformer(key)] = (
        recurse ? transformKeys(value, transformer, true) : value
      )

      return result
    }, {})
  }

  throw new TypeError(`Expected array or object. Received ${sourceType}.`)
}

/**
 * @private
 */
export function camelizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => camelize(underscore(key), true), deep)
}

/**
 * @private
 */
export function dasherizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => dasherize(underscore(key), true), deep)
}

/**
 * @private
 */
export function underscoreKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => underscore(key), deep)
}
