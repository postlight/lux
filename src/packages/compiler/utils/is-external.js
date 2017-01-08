// @flow

// eslint-disable-next-line max-len
const PATTERN = /^(?![./\\]+|[A-Z]:\\.+\\app|app|lux-framework|LUX_LOCAL|\u0000?babelHelpers)/;

/**
 * @private
 */
export default function isExternal(id: string): boolean {
  return PATTERN.test(id);
}
