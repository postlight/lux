/* @flow */

import { camelize, dasherize, underscore } from '@lux/packages/inflector'
import { isInstance, isObject } from '@lux/utils/is-type'

type Transform = (key: string) => string

export const transformKeys = <T: Object>(
  src: T,
  fn: Transform,
  deep?: boolean,
): T => {
  // $FlowFixMe
  const dest: T = {}

  return Object.entries(src).reduce((prev, entry) => {
    const next = prev
    const [key] = entry
    let [, value] = entry

    if (deep && isObject(value) && !isInstance(value, Date)) {
      value = transformKeys(value, fn, true)
    }

    next[fn(key)] = value
    return next
  }, dest)
}

export const camelizeKeys = <T: Object>(source: T, deep?: boolean) =>
  transformKeys(source, camelize, deep)

export const dasherizeKeys = <T: Object>(source: T, deep?: boolean) =>
  transformKeys(source, dasherize, deep)

export const underscoreKeys = <T: Object>(source: T, deep?: boolean) =>
  transformKeys(source, underscore, deep)
