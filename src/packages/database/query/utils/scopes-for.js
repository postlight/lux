// @flow
import type Query from '../index';

export default function scopesFor<T>(target: Query<T>): {
  [key: string]: () => Query<T>
} {
  return Object.keys(target.model.scopes).reduce((scopes, name) => ({
    ...scopes,
    [name]: {
      get() {
        const scope = function (...args: Array<any>) {
          const fn = Reflect.get(target.model, name);
          const { snapshots } = Reflect.apply(fn, target.model, args);

          target.snapshots = [
            ...target.snapshots,
            ...snapshots.map(snapshot => [
              ...snapshot,
              name
            ])
          ];

          return target;
        };

        Reflect.defineProperty(scope, 'name', {
          value: name,
          writable: false,
          enumerable: false,
          configurable: false
        });

        return scope;
      }
    }
  }), {});
}
