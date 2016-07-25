// @flow
import Parameter from '../parameter';
import ParameterGroup from '../parameter-group';

import isNull from '../../../../utils/is-null';
import { typeForColumn } from '../../../database';

import type Controller from '../../../controller';
import type { ParameterGroup$contents } from '../parameter-group/interfaces';

/**
 * @private
 */
function getIDParam({ model }: Controller): [string, ParameterGroup$contents] {
  return ['id', new Parameter({
    type: typeForColumn(model.columnFor(model.primaryKey)),
    path: 'data.id',
    required: true
  })];
}

/**
 * @private
 */
function getTypeParam(): [string, ParameterGroup$contents] {
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
}: Controller): [string, ParameterGroup$contents] {
  return ['attributes', new ParameterGroup(params.map(param => {
    const col = model.columnFor(param);
    const type = typeForColumn(col);
    const path = `data.attributes.${param}`;
    const required = !col.nullable && isNull(col.defaultValue);

    return [param, new Parameter({ type, path, required })];
  }), {
    path: 'data.attributes',
    required: true
  })];
}

/**
 * @private
 */
export default function getDataParams(
  controller: Controller,
  includeID: boolean
): [string, ParameterGroup$contents] {
  let params = [
    getTypeParam(),
    getAttributesParam(controller)
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
