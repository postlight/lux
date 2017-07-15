/* @flow */

import { isObject } from '@lux/utils/is-type'
import type { Model } from '@lux/packages/database'

const resolve = <T: Model>(model: Class<T>, objMap?: Object = {}): Object =>
  Object.entries(objMap).reduce((prev, [key, value]) => {
    const next = prev

    if (isObject(value) && isObject(value.data)) {
      const opts = model.relationshipFor(key)

      if (opts) {
        if (Array.isArray(value.data)) {
          next[key] = value.data.map(item =>
            Reflect.construct(opts.model, [item]),
          )
        } else {
          next[key] = Reflect.construct(opts.model, [value.data])
        }
      }
    }

    return next
  }, {})

export default resolve
