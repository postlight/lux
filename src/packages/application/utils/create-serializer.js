/* @flow */

import { posix } from 'path'

import { deepFreezeProps } from '@lux/packages/freezeable'
import { tryCatchSync } from '@lux/utils/try-catch'
import type Serializer from '@lux/packages/serializer' // eslint-disable-line max-len, no-unused-vars
import type { Application$factoryOpts } from '../index'

export default function createSerializer<T: Serializer<*>>(
  constructor: Class<T>,
  opts: Application$factoryOpts<T>,
): T {
  const { key, store } = opts
  const namespace = posix.dirname(key).replace('.', '')
  let { parent } = opts
  let model = tryCatchSync(() => store.modelFor(posix.basename(key)))

  if (!model) {
    model = null
  }

  if (!parent) {
    parent = null
  }

  const instance: T = Reflect.construct(constructor, [
    {
      model,
      parent,
      namespace,
    },
  ])

  Reflect.defineProperty(instance, 'parent', {
    value: parent,
    writable: false,
    enumerable: true,
    configurable: false,
  })

  return deepFreezeProps(instance, true, 'hasOne', 'hasMany', 'attributes')
}
