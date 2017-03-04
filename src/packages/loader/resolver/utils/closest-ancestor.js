/* @flow */

import { posix } from 'path';

import type { Bundle$Namespace } from '../../index';

export default function closestAncestor<T>(
  source: Bundle$Namespace<T>,
  key: string
): void | T {
  const name = posix.basename(key);
  let namespace = posix.dirname(key);

  if (namespace === '.') {
    return source.get(name);
  }

  namespace = posix.dirname(namespace);

  const ancestor = source.get(posix.join(namespace, name));

  if (ancestor) {
    return ancestor;
  }

  return closestAncestor(
    source,
    posix.join(posix.dirname(namespace), name)
  );
}
