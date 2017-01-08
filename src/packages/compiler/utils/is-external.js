// @flow

// eslint-disable-next-line max-len
const PATTERN = /^(?![./\\]+|[A-Z]:\\.+\\(?:app|dist)|app|dist|lux-framework|LUX_LOCAL|\u0000?babelHelpers)/;

/**
 * @private
 */
export default function isExternal(id: string): boolean {
  return PATTERN.test(id);
}
