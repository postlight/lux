// @flow
import { deepFreezeProps } from '../../freezeable';
import { getNamespaceKey, stripNamespaces } from '../../loader';

import { tryCatchSync } from '../../../utils/try-catch';

import type Serializer from '../../serializer'; // eslint-disable-line max-len, no-unused-vars
import type { Application$factoryOpts } from '../index';

export default function createSerializer<T: Serializer<*>>(
  constructor: Class<T>,
  opts: Application$factoryOpts<T>
): T {
  const { key, store } = opts;
  const namespace = getNamespaceKey(key).replace('root', '');
  let { parent } = opts;
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

  return deepFreezeProps(instance, true,
    'hasOne',
    'hasMany',
    'attributes'
  );
}
