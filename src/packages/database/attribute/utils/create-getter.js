/* @flow */

import type { Attribute$meta } from '../index'
import { isNil } from '@lux/utils/is-type'

export default function createGetter({
  key,
  defaultValue,
}: Attribute$meta): () => any {
  return function getter() {
    let value = this.currentChangeSet.get(key)

    if (isNil(value)) {
      value = defaultValue
    }

    return value
  }
}
