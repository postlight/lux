// @flow
import Parameter from '../parameter';
import ParameterGroup from '../parameter-group';
import isNull from '../../../../../utils/is-null';
import { typeForColumn } from '../../../../database';
import type Controller from '../../../../controller';
import type { ParameterLike } from '../interfaces';

type ParamTuple = [string, ParameterLike];

/**
 * @private
 */
function getIDParam({ model }: Controller<*>): ParamTuple {
  let primaryKeyType = 'number';

  if (model) {
    const primaryKeyColumn = model.columnFor(model.primaryKey);

    if (primaryKeyColumn) {
      primaryKeyType = typeForColumn(primaryKeyColumn);
    }
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
function getTypeParam(controller: Controller<*>): ParamTuple {
  if (controller.model) {
    return ['type', new Parameter({
      type: 'string',
      path: 'data.type',
      values: [controller.model.resourceName],
      required: true
    })];
  }

  return ['type', new Parameter({
    type: 'string',
    path: 'data.type',
    required: true
  })];
}

/**
 * @private
 */
function getAttributesParam({
  model,
  params
}: Controller<*>): ParamTuple {
  return ['attributes', new ParameterGroup(params.reduce((group, param) => {
    const path = `data.attributes.${param}`;

    if (model) {
      const col = model.columnFor(param);

      if (col) {
        const type = typeForColumn(col);
        const required = !col.nullable && isNull(col.defaultValue);

        return [
          ...group,
          [param, new Parameter({ type, path, required })]
        ];
      }

      return group;
    }

    return [
      ...group,
      [param, new Parameter({
        path,
        required: false
      })]
    ];
  }, []), {
    path: 'data.attributes',
    sanitize: true
  })];
}

/**
 * @private
 */
function getRelationshipsParam(controller: Controller<*>): ParamTuple {
  if (controller.model) {
    const { model, params } = controller;

    return [
      'relationships',
      new ParameterGroup(params.reduce((group, param) => {
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
      })
    ];
  }

  return ['relationships', new ParameterGroup([], {
    path: 'data.relationships'
  })];
}

/**
 * @private
 */
export default function getDataParams(
  controller: Controller<*>,
  includeID: boolean
): ParamTuple {
  let params = [getTypeParam(controller)];

  if (controller.hasModel) {
    params = [
      getAttributesParam(controller),
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
