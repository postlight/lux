// @flow
import { Model } from '../../database';

import merge from '../../../utils/merge';
import paramsToQuery from './params-to-query';

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

  const result = await model.find(id)
    .select(...select)
    .include(include);

  return result instanceof Model ? result : null;
}
