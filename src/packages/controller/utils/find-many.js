/* @flow */

import merge from '../../../utils/merge';
import type { Model, Query } from '../../database';
import type Request from '../../request';

import paramsToQuery from './params-to-query';

/**
 * @private
 */
export default function findMany<T: Model>(
  model: Class<T>,
  req: Request
): Query<Array<Model>> {
  const params = merge(req.defaultParams, req.params);
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
