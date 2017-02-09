// @flow
import type { ObjectMap } from '../../../../interfaces';
import type Query from '../index';

export default function scopesFor<T>(
  target: Query<T>
): ObjectMap<string, (...args: Array<any>) => Query<T>> {
  return Object.keys(target.model.scopes).reduce((scopes, name) => {
    const result = scopes;

    result[name] = {
      get() {
        // eslint-disable-next-line func-names
        const scope = function (...args: Array<any>) {
          // $FlowIgnore
          const fn = target.model[name];
          const { snapshots } = fn.apply(target.model, args);

          Object.assign(target, {
            snapshots: [
              ...target.snapshots,
              ...snapshots.map(snapshot => [
                ...snapshot,
                name
              ])
            ]
          });

          return target;
        };

        Object.defineProperty(scope, 'name', {
          value: name,
          writable: false,
          enumerable: false,
          configurable: false
        });

        return scope;
      }
    };

    return result;
  }, {});
}
