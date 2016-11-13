// @flow

/**
 * @private
 */
export function tap<T>(input: T): T {
  console.log(input); // eslint-disable-line no-console
  return input;
}

/**
 * @private
 */
export function compose<T>(...funcs: Array<(input: T) => T>): (input: T) => T {
  return input => funcs.reduceRight((value, fn) => fn(value), input);
}

/**
 * @private
 */
export function composeAsync<T>(
  ...funcs: Array<(input: T) => T | Promise<T>>
): (input: T) => Promise<T> {
  return input => funcs.reduceRight(
    (value, fn) => Promise.resolve(value).then(fn),
    Promise.resolve(input)
  );
}
