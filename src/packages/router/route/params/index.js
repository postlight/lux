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

import type Controller from '../../../controller';
import type { Params$opts } from './interfaces';

/**
 * @private
 */
export function paramsFor({
  type,
  method,
  controller,
  dynamicSegments
}: Params$opts) {
  let params = getURLParams(dynamicSegments);

  if (type === 'member') {
    params = [
      ...params,
      ...getMemberQueryParams(controller)
    ];

    if (method === 'POST' || method === 'PATCH') {
      params = [
        ...params,
        getDataParams(controller, true)
      ];
    }
  } else if (type === 'collection') {
    params = [
      ...params,
      ...getCollectionQueryParams(controller)
    ];

    if (method === 'POST' || method === 'PATCH') {
      params = [
        ...params,
        getDataParams(controller, false)
      ];
    }
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
  type,
  controller
}: {
  type: string;
  controller: Controller
}): Object {
  if (controller.hasModel) {
    if (type === 'member') {
      return getDefaultMemberParams(controller);
    } else if (type === 'collection') {
      return getDefaultCollectionParams(controller);
    } else {
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
