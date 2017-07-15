/* @flow */

import { isObject } from '@lux/utils/is-type'
import type Query from '../../index'

export default function getFindParam({
  isFind,
  snapshots,
  model: { tableName, primaryKey },
}: Query<*>) {
  if (isFind) {
    const snapshot = snapshots.find(([method]) => method === 'where')

    if (snapshot) {
      const [, params] = snapshot

      if (params && isObject(params)) {
        return Reflect.get(params, `${tableName}.${primaryKey}`)
      }
    }
  }

  return undefined
}
