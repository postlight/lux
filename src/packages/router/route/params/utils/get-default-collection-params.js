// @flow
import type Controller from '../../../../controller';

/**
 * @private
 */
function getDefaultCollectionParams(controller: Controller<*>): Object {
  if (controller.model) {
    const {
      model,
      defaultPerPage,
      serializer: {
        hasOne,
        hasMany,
        attributes
      }
    } = controller;

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

  return {
    sort: 'createdAt',
    filter: {},
    fields: {},
    page: {
      size: 25,
      number: 1
    }
  };
}

export default getDefaultCollectionParams;
