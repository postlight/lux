// @flow
export default function hasOwnProperty(target: Object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}
