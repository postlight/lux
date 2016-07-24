// @flow
import type Controller from '../../../controller';

export default function getDefaultShowParams({
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
