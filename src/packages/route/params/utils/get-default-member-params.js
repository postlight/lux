// @flow
import type Controller from '../../../controller';

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
        const { model: related } = model.relationshipFor(key);

        return {
          ...include,
          [related.resourceName]: [related.primaryKey]
        };
      }, {})
    }
  };
}
