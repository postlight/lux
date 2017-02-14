// @flow
import merge from '../../../utils/merge';
// eslint-disable-next-line no-unused-vars
import type { Model, Query } from '../../database';
import type { Request } from '../../request';

import paramsToQuery from './params-to-query';

/**
 * @private
 */
function findOne<T: Model>(model: Class<T>, request: Request): Query<T> {
  const params = merge(request.defaultParams, request.params);
  const { id, select, include } = paramsToQuery(model, params);

  return model.find(id)
    .select(...select)
    .include(include);
}

export default findOne;
