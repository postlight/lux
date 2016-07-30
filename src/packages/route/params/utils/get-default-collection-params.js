// @flow
import type Controller from '../../../controller';

/**
 * @private
 */
export default function getDefaultCollectionParams({
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
        const opts = model.relationshipFor(key);

        if (opts) {
          return {
            ...include,
            [opts.model.resourceName]: [opts.model.primaryKey]
          };
        } else {
          return include;
        }
      }, {})
    },

    page: {
      size: defaultPerPage,
      number: 1
    }
  };
}
