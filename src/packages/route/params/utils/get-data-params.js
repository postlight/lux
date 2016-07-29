// @flow
import Parameter from '../parameter';
import ParameterGroup from '../parameter-group';

import isNull from '../../../../utils/is-null';
import { typeForColumn } from '../../../database';

import type Controller from '../../../controller';
import type { ParameterLike } from '../interfaces';

/**
 * @private
 */
function getIDParam({ model }: Controller): [string, ParameterLike] {
  return ['id', new Parameter({
    type: typeForColumn(model.columnFor(model.primaryKey)),
    path: 'data.id',
    required: true
  })];
}

/**
 * @private
 */
function getTypeParam({
  model
}: Controller): [string, ParameterLike] {
  return ['type', new Parameter({
    type: 'string',
    path: 'data.type',
    values: [model.resourceName],
    required: true
  })];
}

/**
 * @private
 */
function getAttributesParam({
  model,
  params
}: Controller): [string, ParameterLike] {
  params = params.filter(param => Boolean(model.columnFor(param)));

  return ['attributes', new ParameterGroup(params.map(param => {
    const col = model.columnFor(param);
    const type = typeForColumn(col);
    const path = `data.attributes.${param}`;
    const required = !col.nullable && isNull(col.defaultValue);

    return [param, new Parameter({ type, path, required })];
  }), {
    path: 'data.attributes',
    required: true,
    sanitize: true
  })];
}

/**
 * @private
 */
function getRelationshipsParam({
  model,
  params
}: Controller): [string, ParameterLike] {
  params = params.filter(param => Boolean(model.relationshipFor(param)));

  return ['relationships', new ParameterGroup(params.map(param => {
    const path = `data.relationships.${param}`;
    const related = model.relationshipFor(param);

    if (related.type === 'hasMany') {
      return [param, new ParameterGroup([
        ['data', new Parameter({
          type: 'array',
          path: `${path}.data`,
          required: true
        })]
      ], {
        path
      })];
    } else {
      const { model: { primaryKey } } = related;

      return [param, new ParameterGroup([
        ['data', new ParameterGroup([
          ['id', new Parameter({
            type: typeForColumn(related.model.columnFor(primaryKey)),
            path: `${path}.data.id`,
            required: true
          })],

          ['type', new Parameter({
            type: 'string',
            path: `${path}.data.type`,
            values: [related.model.resourceName],
            required: true
          })]
        ], {
          type: 'array',
          path: `${path}.data`,
          required: true
        })]
      ], {
        path
      })];
    }
  }), {
    path: 'data.relationships'
  })];
}

/**
 * @private
 */
export default function getDataParams(
  controller: Controller,
  includeID: boolean
): [string, ParameterLike] {
  let params = [
    getTypeParam(controller),
    getAttributesParam(controller),
    getRelationshipsParam(controller)
  ];

  if (includeID) {
    params = [
      getIDParam(controller),
      ...params
    ];
  }

  return ['data', new ParameterGroup(params, {
    path: 'data',
    required: true
  })];
}
