/* @flow */

export default function hasOwnProperty(target: Object, key: string): boolean {
  return Reflect.apply(
    Object.prototype.hasOwnProperty,
    target,
    [key]
  );
}
