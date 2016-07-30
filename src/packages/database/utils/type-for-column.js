// @flow
import { TYPE_ALIASES } from '../constants';

import type { Database$column } from '../interfaces';

/**
 * @private
 */
export default function typeForColumn(column: Database$column) {
  return TYPE_ALIASES.get(column.type);
}
