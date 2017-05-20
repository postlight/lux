/* @flow */

import entries from '../../../utils/entries'
import isObject from '../../../utils/is-object'
import type { ObjectMap } from '../../../interfaces'

const INT = /^\d+$/
const CSV = /^(?:[\w\d-]+)(?:,[\w\d-]+){1,}$/
const NULL = /^null$/
const BOOL = /^(?:true|false)$/
const DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{4})$/
const TRUE = /^true$/
const DELIMITER = /[_-\s]+/

export function camelize(source: string): string {
  return source
    .split(DELIMITER)
    .reduce((result, part, idx) => {
      if (part[0]) {
        const [first] = part

        return (
          result
          + (idx === 0 ? first.toLowerCase() : first.toUpperCase())
          + part.slice(1).toLowerCase()
        )
      }

      return result
    }, '')
}

export function fromString(source: string): any {
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

export function fromObject(source: ObjectMap<any>): ObjectMap<any> {
  return entries(source).reduce((target, [k, v]) => {
    const key = camelize(k)
    let value = v

    if (typeof value === 'string') {
      value = fromString(value)
    } else if (isObject(value)) {
      value = fromObject(value)
    }

    if (key === 'include') {
      if (value && !Array.isArray(value)) {
        value = [value]
      }

      value = value.map(item => {
        if (typeof item === 'string') {
          return camelize(item)
        }
        return item
      })
    } else if (key === 'fields' && isObject(value)) {
      value = entries(value).reduce((fields, [resource, names]) => {
        // eslint-disable-next-line no-param-reassign
        fields[resource] = (
          Array.isArray(names) ? names : [names]
        ).map(item => {
          if (typeof item === 'string') {
            return camelize(item)
          }
          return item
        })
        return fields
      }, {})
    }

    // eslint-disable-next-line no-param-reassign
    target[key] = value

    return target
  }, {})
}
