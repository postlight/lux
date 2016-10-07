// @flow
import merge from '../../../utils/merge';
import type { Model, Query } from '../../database'; // eslint-disable-line max-len, no-unused-vars
import type { Request } from '../../server';

import paramsToQuery from './params-to-query';

/**
 * @private
 */
export default function findOne<T: Model>(
  model: Class<T>,
  req: Request
): Query<T> {
  const params = merge(req.defaultParams, req.params);
  const { id, select, include } = paramsToQuery(model, params);

  return model.find(id)
    .select(...select)
    .include(include);
}
