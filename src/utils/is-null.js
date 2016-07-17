// @flow
export default function isNull(value: ?mixed): boolean {
  return !value && typeof value === 'object';
}
