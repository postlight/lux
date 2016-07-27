// @flow
import { FREEZER } from '../constants';

/**
 * @private
 */
export default function freeze<T>(value: T) {
  FREEZER.add(value);
  return value;
}
