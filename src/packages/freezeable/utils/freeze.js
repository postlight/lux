// @flow
import { FREEZER } from '../constants';

/**
 * @private
 */
export default function freeze<T: Object>(value: T): T {
  FREEZER.add(value);
  return value;
}
