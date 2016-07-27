// @flow
import omit from '../../../utils/omit';
import entries from '../../../utils/entries';

import typeof { Model } from '../../database';
import type { Request$params } from '../../server';

/**
 * @private
 */
export default function paramsToQuery(model: Model, {
  id,
  page,
  sort,
  filter,
  fields,
  include
}: Request$params): Object {
  const relationships = entries(model.relationships);
  let includedFields = omit(fields, model.resourceName);

  let query = {
    id,
    filter,
    select: [model.primaryKey, ...Reflect.get(fields, model.resourceName)]
  };

  if (page) {
    query = {
      ...query,
      page: page.number,
      limit: page.size
    };
  }

  if (sort) {
    if (sort.startsWith('-')) {
      query = {
        ...query,
        sort: [sort.substr(1), 'DESC']
      };
    } else {
      query = {
        ...query,
        sort: [sort, 'ASC']
      };
    }
  }

  includedFields = entries(includedFields).reduce((result, [key, value]) => {
    const [
      name,
      relationship
    ] = relationships.find(([, { model: related }]) => {
      return key === related.resourceName;
    });

    if (!relationship) {
      return result;
    }

    if (!value.includes(relationship.model.primaryKey)) {
      value = [relationship.model.primaryKey, ...value];
    }

    if (include && value.length === 1 && include.includes(name)) {
      value = [...value, ...relationship.model.serializer.attributes];
    } else if (!include && value.length > 1) {
      value = value.slice(0, 1);
    }

    return {
      ...result,
      [name]: value
    };
  }, {});

  return {
    ...query,
    include: includedFields
  };
}
