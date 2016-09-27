// @flow
import type Controller from '../../../../controller';

/**
 * @private
 */
export default function getDefaultCollectionParams({
  model,
  defaultPerPage,
  serializer: {
    hasOne,
    hasMany,
    attributes
  }
}: Controller): Object {
  return {
    sort: 'createdAt',
    filter: {},
    fields: {
      [model.resourceName]: attributes,
      ...[...hasOne, ...hasMany].reduce((include, key) => {
        const opts = model.relationshipFor(key);

        if (!opts) {
          return include;
        }

        return {
          ...include,
          [opts.model.resourceName]: [opts.model.primaryKey]
        };
      }, {})
    },
    page: {
      size: defaultPerPage,
      number: 1
    }
  };
}
