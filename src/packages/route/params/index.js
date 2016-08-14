// @flow
import ParameterGroup from './parameter-group';

import getURLParams from './utils/get-url-params';
import getDataParams from './utils/get-data-params';
import getDefaultMemberParams from './utils/get-default-member-params';
import getDefaultCollectionParams from './utils/get-default-collection-params';

import {
  getMemberQueryParams,
  getCollectionQueryParams
} from './utils/get-query-params';

import type Controller from '../../controller';
import type { Params$opts } from './interfaces';

/**
 * @private
 */
export function paramsFor({
  action,
  method,
  controller,
  dynamicSegments
}: Params$opts) {
  let params = getURLParams(dynamicSegments);

  switch (method) {
    case 'GET':
      if (action === 'show') {
        params = [
          ...params,
          ...getMemberQueryParams(controller)
        ];
      } else {
        params = [
          ...params,
          ...getCollectionQueryParams(controller)
        ];
      }
      break;

    case 'POST':
      params = [
        ...params,
        ...getMemberQueryParams(controller),
        getDataParams(controller, false)
      ];
      break;

    case 'PATCH':
      params = [
        ...params,
        ...getMemberQueryParams(controller),
        getDataParams(controller, true)
      ];
      break;
  }

  return new ParameterGroup(params, {
    path: '',
    required: true
  });
}

/**
 * @private
 */
export function defaultParamsFor({
  action,
  controller
}: {
  action: string;
  controller: Controller
}): Object {
  if (controller.hasModel) {
    switch (action) {
      case 'index':
        return getDefaultCollectionParams(controller);

      case 'show':
      case 'create':
      case 'update':
      case 'destroy':
        return getDefaultMemberParams(controller);

      default:
        return {};
    }
  } else {
    return {};
  }
}

export { default as validateResourceId } from './utils/validate-resource-id';

export type { ParameterLike, ParameterLike$opts } from './interfaces';
export type { default as Parameter } from './parameter';
export type { default as ParameterGroup } from './parameter-group';
