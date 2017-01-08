// @flow
import path from 'path';

/**
 * @private
 */
export default function isExternal(dir: string, id: string): boolean {
  return !(
    id.startsWith('.')
    || id.startsWith('/')
    || id.startsWith('app')
    || id.startsWith(path.join(dir, 'app'))
    || id === 'lux-framework'
    || id === 'LUX_LOCAL'
    || id === 'babelHelpers'
    || id === '\u0000babelHelpers'
  );
}
