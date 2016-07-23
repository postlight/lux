// @flow
import type Controller from '../../../controller';

export default function getDefaultShowParams({
  model,
  attributes,
  relationships
}: Controller): Object {
  return {
    fields: attributes,

    include: relationships.reduce((include, key) => ({
      ...include,
      [key]: [model.relationshipFor(key).model.primaryKey]
    }), {})
  };
}
