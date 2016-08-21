// @flow
import type Controller from '../../../../controller';

/**
 * @private
 */
export default function getDefaultMemberParams({
  model,
  attributes,
  relationships
}: Controller): Object {
  return {
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
    }
  };
}
