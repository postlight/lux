// @flow
import type { Bundle$Namespace } from '../../index';

export default function closestAncestor<T>(
  source: Bundle$Namespace<T>,
  key: string
): void | T {
  const parts = key.split('/');

  if (parts.length > 2) {
    const name = parts.pop();
    const part = `${parts.slice(0, parts.length - 1).join('/')}/${name}`;

    return source.get(part) || closestAncestor(source, part);
  } else if (parts.length === 2) {
    return source.get(parts.pop());
  }

  return undefined;
}
