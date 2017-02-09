// @flow
import type Controller from '../../../../controller';

/**
 * @private
 */
function getDefaultMemberParams(controller: Controller<*>): Object {
  if (controller.model) {
    const {
      model,
      serializer: {
        hasOne,
        hasMany,
        attributes
      }
    } = controller;

    return {
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
      }
    };
  }

  return {
    fields: {}
  };
}

export default getDefaultMemberParams;
