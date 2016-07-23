// @flow
import Parameter from '../parameter';
import ParameterGroup from '../parameter-group';

import type Controller from '../../../controller';
import type { ParameterGroup$contents } from '../parameter-group/interfaces';

function getPageParam(): [string, ParameterGroup$contents] {
  return ['page', new ParameterGroup([
    ['size', new Parameter({ path: 'page.size', type: 'number' })],
    ['number', new Parameter({ path: 'page.number', type: 'number' })]
  ], {
    path: 'page'
  })];
}

function getSortParam({
  sort
}: Controller): [string, ParameterGroup$contents] {
  return ['sort', new Parameter({
    path: 'sort',
    type: 'string',

    values: [
      ...sort,
      ...sort.map(value => `-${value}`)
    ]
  })];
}

function getFilterParam({
  filter
}: Controller): [string, ParameterGroup$contents] {
  return ['filter', new ParameterGroup(filter.map(param => [
    param,
    new Parameter({
      path: `filter.${param}`
    })
  ]), {
    path: 'filter'
  })];
}

function getFieldsParam({
  model,
  attributes,
  relationships
}: Controller): [string, ParameterGroup$contents] {
  return ['fields', new ParameterGroup([
    [model.resourceName, new Parameter({
      path: `fields.${model.resourceName}`,
      type: 'array',
      values: attributes
    })],

    ...relationships.map(relationship => {
      const { model: relatedModel } = model.relationshipFor(relationship);

      return [relatedModel.resourceName, new Parameter({
        path: `fields.${relatedModel.resourceName}`,
        type: 'array',

        values: [
          relatedModel.primaryKey,
          ...relatedModel.serializer.attributes
        ]
      })];
    })
  ], {
    path: 'fields'
  })];
}

function getIncludeParam({
  relationships
}: Controller): [string, ParameterGroup$contents] {
  return ['include', new Parameter({
    path: 'include',
    type: 'array',
    values: relationships
  })];
}

export default function getQueryParams(
  controller: Controller
): Array<[string, ParameterGroup$contents]> {
  return [
    getPageParam(),
    getSortParam(controller),
    getFilterParam(controller),
    getFieldsParam(controller),
    getIncludeParam(controller)
  ];
}
