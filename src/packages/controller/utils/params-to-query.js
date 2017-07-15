/* @flow */

import omit from '@lux/utils/omit'
import { isUndefined } from '@lux/utils/is-type'
import type { Model, Relationship } from '@lux/packages/database'

const paramsToQuery = (model: Class<Model>, params: Object): Object => {
  const { id, page, sort, filter, fields, include } = params
  // $FlowFixMe
  const relationships: Array<[string, Relationship]> = Object.entries(
    model.relationships,
  )

  let query = {
    id,
    filter,
    include: {},
    select: [model.primaryKey, ...Reflect.get(fields, model.resourceName)],
  }

  if (page) {
    query = {
      ...query,
      page: page.number,
      limit: page.size,
    }
  }

  if (sort) {
    if (sort.startsWith('-')) {
      query = {
        ...query,
        sort: [sort.substr(1), 'DESC'],
      }
    } else {
      query = {
        ...query,
        sort: [sort, 'ASC'],
      }
    }
  }

  query.include = Object.entries(
    omit(fields, model.resourceName),
  ).reduce((prev, field) => {
    const next = prev
    const [key] = field
    let [, value] = field

    const [name, relationship] =
      relationships.find(
        ([, { model: related }]) => key === related.resourceName,
      ) || []

    if (
      isUndefined(name) ||
      isUndefined(relationship) ||
      !Array.isArray(value)
    ) {
      return next
    }

    if (!value.includes(relationship.model.primaryKey)) {
      value = [relationship.model.primaryKey, ...value]
    }

    if (include && value.length === 1 && include.includes(name)) {
      value = [...value, ...relationship.model.serializer.attributes]
    } else if (!include && value.length > 1) {
      value = value.slice(0, 1)
    }

    next[name] = value
    return next
  }, {})

  return query
}

export default paramsToQuery
