// @flow

/**
 * @private
 */
export default function getParentKey(source: string): string {
  const parts = source.split('/');
  const parent = parts.slice(0, Math.max(parts.length - 1, 0)).join('/');

  return parent || 'root';
}
