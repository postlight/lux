// @flow
import type Controller from '../index';

function indexParams({
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

function showParams({
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

/**
 * @private
 */
export default function defaultParamsFor(
  controller: Controller,
  action: string
): Object {
  switch (action) {
    case 'index':
      return indexParams(controller);

    case 'show':
      return showParams(controller);

    default:
      return {};
  }
}
