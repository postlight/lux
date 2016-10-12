// @flow
import type { Bundle$Namespace } from '../../index';

export default function closestChild<T>(
  source: Bundle$Namespace<T>,
  key: string
): void | T {
  const [[, result] = []] = Array
    .from(source)
    .map(([path, value]) => [path.split('/').pop(), value])
    .filter(([resource]) => key === resource);

  return result;
}
