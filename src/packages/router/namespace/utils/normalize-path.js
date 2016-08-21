// @flow

/**
 * @private
 */
export default function normalizePath(path: string) {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1);
  }

  return path;
}
