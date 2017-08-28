// @flow
import Parameter from '../parameter';
import ParameterGroup from '../parameter-group';
import isNull from '../../../../../utils/is-null';
import { typeForColumn } from '../../../../database';
import type Controller from '../../../../controller';
import type { ParameterLike } from '../interfaces';

/**
 * @private
 */
function getIDParam({ model }: Controller): [string, ParameterLike] {
  const primaryKeyColumn = model.columnFor(model.primaryKey);
  let primaryKeyType = 'number';

  if (primaryKeyColumn) {
    primaryKeyType = typeForColumn(primaryKeyColumn);
  }

  return ['id', new Parameter({
    type: primaryKeyType,
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
function getAttributesParam(
  { model, params }: Controller,
  method: 'PATCH' | 'POST',
): [string, ParameterLike] {
  return ['attributes', new ParameterGroup(params.reduce((group, param) => {
    const col = model.columnFor(param);

    if (col) {
      const type = typeForColumn(col);
      const path = `data.attributes.${param}`;
      const required =
        method !== 'PATCH' && !col.nullable && isNull(col.defaultValue);

      return [
        ...group,
        [param, new Parameter({ type, path, required })]
      ];
    }

    return group;
  }, []), {
    path: 'data.attributes',
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
  return ['relationships', new ParameterGroup(params.reduce((group, param) => {
    const path = `data.relationships.${param}`;
    const opts = model.relationshipFor(param);

    if (!opts) {
      return group;
    }

    if (opts.type === 'hasMany') {
      return [
        ...group,

        [param, new ParameterGroup([
          ['data', new Parameter({
            type: 'array',
            path: `${path}.data`,
            required: true
          })]
        ], {
          path
        })]
      ];
    }

    const primaryKeyColumn = opts.model.columnFor(opts.model.primaryKey);
    let primaryKeyType = 'number';

    if (primaryKeyColumn) {
      primaryKeyType = typeForColumn(primaryKeyColumn);
    }

    return [
      ...group,

      [param, new ParameterGroup([
        ['data', new ParameterGroup([
          ['id', new Parameter({
            type: primaryKeyType,
            path: `${path}.data.id`,
            required: true
          })],

          ['type', new Parameter({
            type: 'string',
            path: `${path}.data.type`,
            values: [opts.model.resourceName],
            required: true
          })]
        ], {
          type: 'array',
          path: `${path}.data`,
          required: true
        })]
      ], {
        path
      })]
    ];
  }, []), {
    path: 'data.relationships'
  })];
}

/**
 * @private
 */
export default function getDataParams(
  controller: Controller,
  method: 'PATCH' | 'POST',
  includeID: boolean
): [string, ParameterLike] {
  let params = [getTypeParam(controller)];

  if (controller.hasModel) {
    params = [
      getAttributesParam(controller, method),
      getRelationshipsParam(controller),
      ...params
    ];

    if (includeID) {
      params = [
        getIDParam(controller),
        ...params
      ];
    }
  }

  return ['data', new ParameterGroup(params, {
    path: 'data',
    required: true
  })];
}
