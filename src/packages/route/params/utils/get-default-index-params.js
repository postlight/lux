// @flow
import type Controller from '../../../controller';

export default function getDefaultIndexParams({
  model,
  attributes,
  relationships,
  defaultPerPage
}: Controller): Object {
  return {
    sort: 'createdAt',
    filter: {},

    fields: {
      [model.resourceName]: attributes,

      ...relationships.reduce((include, key) => {
        const { model: related } = model.relationshipFor(key);

        return {
          ...include,
          [related.resourceName]: [related.primaryKey]
        };
      }, {})
    },

    page: {
      size: defaultPerPage,
      number: 1
    }
  };
}
