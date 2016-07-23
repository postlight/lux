// @flow
import type Controller from '../../../controller';

export default function getDefaultIndexParams({
  model,
  attributes,
  relationships,
  defaultPerPage
}: Controller): Object {
  return {
    filter: {},
    fields: attributes,

    sort: [
      'createdAt',
      'ASC'
    ],

    page: {
      size: defaultPerPage,
      number: 1
    },

    include: relationships.reduce((include, key) => ({
      ...include,
      [key]: [model.relationshipFor(key).model.primaryKey]
    }), {})
  };
}
