// @flow
import merge from '../../../utils/merge';
import paramsToQuery from './params-to-query';

import type { Model, Query } from '../../database';
import type { Request } from '../../server';

/**
 * @private
 */
export default function findMany({
  params,
  defaultParams,

  route: {
    controller: {
      model
    }
  }
}: Request): Query<Array<Model>> {
  const {
    sort,
    page,
    limit,
    select,
    filter,
    include
  } = paramsToQuery(model, merge(defaultParams, params));

  return model.select(...select)
    .include(include)
    .limit(limit)
    .page(page)
    .where(filter)
    .order(...sort);
}
