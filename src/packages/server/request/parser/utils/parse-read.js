// @flow
import isObject from '../../../../../utils/is-object';
import parseNestedObject from './parse-nested-object';
import format, { formatSort, formatFields, formatInclude } from './format';

import type { Request } from '../../interfaces';

/**
 * @private
 */
export default function parseRead({ method, url: { query } }: Request): Object {
  const {
    sort,
    fields,
    include,
    ...params
  } = parseNestedObject(query);

  if (sort) {
    params.sort = typeof sort === 'string' ? formatSort(sort) : sort;
  }

  if (fields) {
    params.fields = isObject(fields) ? formatFields(fields) : fields;
  }

  if (include) {
    params.include = formatInclude(include);
  }

  return format(params, method);
}
