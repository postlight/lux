// @flow
import { TYPE_ALIASES } from '../constants';

import type { Database$column } from '../interfaces';

export default function typeForColumn(column: Database$column): void | string {
  return TYPE_ALIASES.get(column.type);
}
