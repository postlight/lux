// @flow
import format, { formatSort, formatFields, formatInclude } from './format';
import entries from '../../../../../utils/entries';

import type { Request } from '../../interfaces';

/**
 * @private
 */
export default function parseRead({ method, url: { query } }: Request): Object {
  const pattern = /^(.+)\[(.+)\]$/g;

  const {
    sort,
    fields,
    include,
    ...params
  } = entries(query).reduce((result, [key, value]) => {
    if (pattern.test(key)) {
      const parentKey = key.replace(pattern, '$1');
      const parentValue = result[parentKey];

      return {
        ...result,

        [parentKey]: {
          ...(parentValue || {}),
          [key.replace(pattern, '$2')]: value
        }
      };
    } else {
      return {
        ...result,
        [key]: value
      };
    }
  }, {});

  if (sort) {
    params.sort = formatSort(sort);
  }

  if (fields) {
    params.fields = formatFields(fields);
  }

  if (include) {
    params.include = formatInclude(include);
  }

  return format(params, method);
}
