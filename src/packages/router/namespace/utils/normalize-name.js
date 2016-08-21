// @flow

/**
 * @private
 */
export default function normalizeName(name: string) {
  if (name.startsWith('/')) {
    name = name.substr(1);
  }

  if (name.endsWith('/')) {
    name = name.substr(0, name.length - 1);
  }

  return name;
}
