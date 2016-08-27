// @flow
import { freezeProps } from '../../freezeable';
import { getNamespaceKey, stripNamespaces } from '../../loader';

import { tryCatchSync } from '../../../utils/try-catch';

import type Database from '../../database';
import type Serializer from '../../serializer';

export default function createSerializer<T: Serializer>(constructor: Class<T>, {
  key,
  store,
  parent
}: {
  key: string;
  store: Database;
  parent: ?Serializer;
}): T {
  const namespace = getNamespaceKey(key).replace('root', '');
  let model = tryCatchSync(() => store.modelFor(stripNamespaces(key)));

  if (!model) {
    model = null;
  }

  if (!parent) {
    parent = null;
  }

  const instance: T = Reflect.construct(constructor, [{
    model,
    parent,
    namespace
  }]);

  Reflect.defineProperty(instance, 'parent', {
    value: parent,
    writable: false,
    enumerable: true,
    configurable: false
  });

  return freezeProps(instance, true,
    'hasOne',
    'hasMany',
    'attributes'
  );
}
