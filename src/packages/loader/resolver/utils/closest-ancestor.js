// @flow
import type { Bundle$Namespace } from '../../index';

export default function closestAncestor<T>(
  source: Bundle$Namespace<T>,
  key: string
): void | T {
  const parts = key.split('/');

  if (parts.length > 2) {
    const name = parts.pop();

    key = `${parts.slice(0, parts.length - 1).join('/')}/${name}`;
    return source.get(key) || closestAncestor(source, key);
  } else if (parts.length === 2) {
    return source.get(parts.pop());
  }
}
