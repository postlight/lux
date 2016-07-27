// @flow
import Parameter from '../parameter';
import ParameterGroup from '../parameter-group';

import type Controller from '../../../controller';
import type { ParameterLike } from '../interfaces';

/**
 * @private
 */
function getPageParam(): [string, ParameterLike] {
  return ['page', new ParameterGroup([
    ['size', new Parameter({ path: 'page.size', type: 'number' })],
    ['number', new Parameter({ path: 'page.number', type: 'number' })]
  ], {
    path: 'page'
  })];
}

/**
 * @private
 */
function getSortParam({
  sort
}: Controller): [string, ParameterLike] {
  return ['sort', new Parameter({
    path: 'sort',
    type: 'string',

    values: [
      ...sort,
      ...sort.map(value => `-${value}`)
    ]
  })];
}

/**
 * @private
 */
function getFilterParam({
  filter
}: Controller): [string, ParameterLike] {
  return ['filter', new ParameterGroup(filter.map(param => [
    param,
    new Parameter({
      path: `filter.${param}`
    })
  ]), {
    path: 'filter'
  })];
}

/**
 * @private
 */
function getFieldsParam({
  model,
  attributes,
  relationships
}: Controller): [string, ParameterLike] {
  return ['fields', new ParameterGroup([
    [model.resourceName, new Parameter({
      path: `fields.${model.resourceName}`,
      type: 'array',
      values: attributes,
      sanitize: true
    })],

    ...relationships.map(relationship => {
      const { model: relatedModel } = model.relationshipFor(relationship);

      return [relatedModel.resourceName, new Parameter({
        path: `fields.${relatedModel.resourceName}`,
        type: 'array',
        sanitize: true,

        values: [
          relatedModel.primaryKey,
          ...relatedModel.serializer.attributes
        ]
      })];
    })
  ], {
    path: 'fields',
    sanitize: true
  })];
}

/**
 * @private
 */
function getIncludeParam({
  relationships
}: Controller): [string, ParameterLike] {
  return ['include', new Parameter({
    path: 'include',
    type: 'array',
    values: relationships
  })];
}

/**
 * @private
 */
export default function getQueryParams(
  controller: Controller
): Array<[string, ParameterLike]> {
  return [
    getPageParam(),
    getSortParam(controller),
    getFilterParam(controller),
    getFieldsParam(controller),
    getIncludeParam(controller)
  ];
}
