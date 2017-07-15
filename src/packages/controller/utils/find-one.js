/* @flow */

import merge from '@lux/utils/merge'
import type { Model, Query } from '@lux/packages/database'
import type Request from '@lux/packages/request'

import paramsToQuery from './params-to-query'

/**
 * @private
 */
function findOne<T: Model>(model: Class<T>, request: Request): Query<T> {
  const params = merge(request.defaultParams, request.params)
  const { id, select, include } = paramsToQuery(model, params)

  return model.find(id).select(...select).include(include)
}

export default findOne
