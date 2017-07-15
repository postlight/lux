/* @flow */

import type Query from '../index'

type Scopes<T> = {
  [key: string]: () => Query<T>,
}

const scopesFor = <T>(target: Query<T>): Scopes<T> =>
  Object.keys(target.model.scopes).reduce(
    (scopes, name) => ({
      ...scopes,
      [name]: {
        get() {
          const scope = function _(...args: Array<any>) {
            const fn = Reflect.get(target.model, name)
            const { snapshots } = fn.apply(target.model, args)

            Object.assign(target, {
              snapshots: [
                ...target.snapshots,
                ...snapshots.map(snapshot => [...snapshot, name]),
              ],
            })

            return target
          }

          Object.defineProperty(scope, 'name', {
            value: name,
          })

          return scope
        },
      },
    }),
    {},
  )

export default scopesFor
