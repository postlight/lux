/* @flow */

import { isNil, isObject, isString } from '@lux/utils/is-type'
import type { ObjectMap } from '../../../interfaces'

const INT = /^\d+$/
const CSV = /^(?:[\w\d-]+)(?:,[\w\d-]+){1,}$/
const NULL = /^null$/
const BOOL = /^(?:true|false)$/
const DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{4})$/
const TRUE = /^true$/
const DELIMITER = /[_-\s]+/

export const camelize = (source: string): string =>
  source.split(DELIMITER).reduce((result, part, idx) => {
    if (part[0]) {
      const [first] = part

      return (
        result +
        (idx === 0 ? first.toLowerCase() : first.toUpperCase()) +
        part.slice(1).toLowerCase()
      )
    }

    return result
  }, '')

const fromString = (source: string): any => {
  if (INT.test(source)) {
    return Number.parseInt(source, 10)
  } else if (BOOL.test(source)) {
    return TRUE.test(source)
  } else if (NULL.test(source)) {
    return null
  } else if (CSV.test(source)) {
    return source.split(',').map(fromString)
  } else if (DATE.test(source)) {
    return new Date(source)
  }
  return source
}

const wrapValue = source => {
  if (Array.isArray(source)) {
    return source.map(item => (isString(item) ? camelize(item) : item))
  }

  if (isNil(source)) {
    return []
  }

  return [isString(source) ? camelize(source) : source]
}

export const fromObject = <T, U>(source: ObjectMap<T>): ObjectMap<U> =>
  Object.entries(source).reduce((prev, entry) => {
    const next = prev
    let [key, value] = entry

    key = camelize(key)

    if (isString(value)) {
      value = fromString(value)
    } else if (isObject(value)) {
      value = fromObject(value)
    }

    if (key === 'include') {
      value = wrapValue(value)
    }

    next[key] = value

    return next
  }, {})
