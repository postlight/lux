// @flow
import merge from '../../../utils/merge';
import paramsToQuery from './params-to-query';

import type { Model } from '../../database';
import type { Request } from '../../server';

/**
 * @private
 */
export default async function findOne({
  params,
  defaultParams,

  route: {
    controller: {
      model
    }
  }
}: Request): Promise<?Model> {
  const {
    id,
    select,
    include
  } = paramsToQuery(model, merge(defaultParams, params));

  return await model.find(id)
    .select(...select)
    .include(include);
}
