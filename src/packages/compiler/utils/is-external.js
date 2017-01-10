// @flow
import path from 'path';

/**
 * @private
 */
export default function isExternal(dir: string): (id: string) => boolean {
  return (id: string): boolean => !(
    id.startsWith('.')
    || id.endsWith('lux-framework')
    || id.startsWith('/') // Absolute path on Unix
    || /^[A-Z]:\\/.test(id) // Absolute path on Windows
    || id.startsWith('app')
    || id.startsWith(path.join(dir, 'app'))
    || id.startsWith(path.join(dir, 'dist'))
    || id === 'LUX_LOCAL'
    || id === 'babelHelpers'
    || id === '\u0000babelHelpers'
  );
}
