// @flow
import merge from '../../../utils/merge';
// eslint-disable-next-line no-unused-vars
import type { Model } from '../../database';
import type { Request } from '../../server';
import type { Thenable } from '../../../interfaces';

import paramsToQuery from './params-to-query';

/**
 * @private
 */
export default function findMany<T: Model>(
  model: Class<T>,
  request: Request
): Thenable<Array<T>> {
  const params = merge(request.defaultParams, request.params);
  const {
    sort,
    page,
    limit,
    select,
    filter,
    include
  } = paramsToQuery(model, params);

  return model.select(...select)
    .include(include)
    .limit(limit)
    .page(page)
    .where(filter)
    .order(...sort);
}
