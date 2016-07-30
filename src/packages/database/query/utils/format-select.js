// @flow
import { camelize } from 'inflection';

import typeof Model from '../../model';

/**
 * @private
 */
export default function formatSelect(
  model: Model,
  attrs: Array<string> = [],
  prefix: string = ''
) {
  return attrs.map(attr => {
    attr = model.columnNameFor(attr) || 'undefined';

    return `${model.tableName}.${attr} AS ${prefix + camelize(attr, true)}`;
  });
}
