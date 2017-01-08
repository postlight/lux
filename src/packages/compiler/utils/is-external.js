// @flow

/**
 * @private
 */
export default function isExternal(id: string): boolean {
  return !(
    id.startsWith('.')
    || id.startsWith('/')
    || id.startsWith('app')
    || id === 'lux-framework'
    || id === 'LUX_LOCAL'
    || id === 'babelHelpers'
    || id === '\u0000babelHelpers'
  );
}
