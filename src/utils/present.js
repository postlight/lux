// @flow
import isNull from './is-null';
import isUndefined from './is-null';

/**
 * @private
 */
export default function present(...values: Array<mixed>): boolean {
  return values.every(value => !isNull(value) && !isUndefined(value));
}
