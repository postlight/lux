// @flow
import { camelize } from 'inflection';

import Model from '../../model';

/**
 * @private
 */
export default function formatSelect(
  model: Class<Model>,
  attrs: Array<string> = [],
  prefix: string = ''
) {
  return attrs.map(attr => {
    attr = model.columnNameFor(attr) || 'undefined';

    return `${model.tableName}.${attr} AS ${prefix + camelize(attr, true)}`;
  });
}
