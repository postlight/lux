// @flow
import { FREEZER } from '../constants';

export default function isFrozen(value: Object): boolean {
  return FREEZER.has(value);
}
