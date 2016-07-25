// @flow

/**
 * @private
 */
export default function createServerError<T: typeof Error | typeof TypeError>(
  target: T,
  statusCode: number
): T {
  Reflect.defineProperty(target.prototype, 'statusCode', {
    value: statusCode,
    writable: false,
    enumerable: true,
    configurable: false
  });

  return target;
}
