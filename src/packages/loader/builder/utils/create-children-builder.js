/* @flow */

import type { Builder$Construct, Builder$ChildrenBuilder } from '../interfaces'

export default function createChildrenBuilder<T>(
  construct: Builder$Construct<T>
): Builder$ChildrenBuilder<T> {
  return target => target.map(({
    key,
    value,
    parent
  }) => [...value].map(([name, constructor]) => {
    const normalized = key === 'root' ? name : `${key}/${name}`

    if (parent && normalized.endsWith('application')) {
      return [
        normalized,
        parent
      ]
    }

    return [
      normalized,
      construct(normalized, constructor, parent)
    ]
  }))
}
