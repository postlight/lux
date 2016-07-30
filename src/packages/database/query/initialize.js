// @flow
import type Query from './index';

const TRAPS = {
  get(target: Query, key: string, receiver: Proxy<Query>): ?mixed | void {
    if (target.model.hasScope(key)) {
      const scope = Reflect.get(target.model.scopes, key);

      return (...args) => {
        let { snapshots } = Reflect.apply(scope, target.model, args);
        snapshots = snapshots.map(snapshot => [...snapshot, key]);

        target.snapshots.push(...snapshots);
        return receiver;
      };
    } else {
      return Reflect.get(target, key);
    }
  }
};

/**
 * @private
 */
export default function initialize(instance: Query): Query {
  return new Proxy(instance, TRAPS);
}
