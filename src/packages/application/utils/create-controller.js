// @flow
import { deepFreezeProps } from '../../freezeable';
import {
  getNamespaceKey,
  stripNamespaces,
  closestAncestor
} from '../../loader';

import { tryCatchSync } from '../../../utils/try-catch';

import type Database from '../../database';
import type Controller from '../../controller'; // eslint-disable-line max-len, no-unused-vars
import type Serializer from '../../serializer';
import type { Bundle$Namespace } from '../../loader';

export default function createController<T: Controller>(constructor: Class<T>, {
  key,
  store,
  parent,
  serializers
}: {
  key: string;
  store: Database;
  parent: ?Controller;
  serializers: Bundle$Namespace<Serializer>;
}): T {
  const namespace = getNamespaceKey(key).replace('root', '');
  let model = tryCatchSync(() => store.modelFor(stripNamespaces(key)));
  let serializer = serializers.get(key);

  if (!model) {
    model = null;
  }

  if (!parent) {
    parent = null;
  }

  if (!serializer) {
    serializer = closestAncestor(serializers, key);
  }

  const instance: T = Reflect.construct(constructor, [{
    model,
    namespace,
    serializer,
    serializers
  }]);

  if (serializer) {
    if (!instance.filter.length) {
      instance.filter = [].concat(serializer.attributes);
    }

    if (!instance.sort.length) {
      instance.sort = [].concat(serializer.attributes);
    }
  }

  if (parent) {
    instance.beforeAction = [
      ...parent.beforeAction,
      ...instance.beforeAction
    ];
  }

  Reflect.defineProperty(instance, 'parent', {
    value: parent,
    writable: false,
    enumerable: true,
    configurable: false
  });

  return deepFreezeProps(instance, true,
    'query',
    'sort',
    'filter',
    'params',
    'beforeAction'
  );
}
