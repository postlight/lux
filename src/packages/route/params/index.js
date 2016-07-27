// @flow
import ParameterGroup from './parameter-group';

import getURLParams from './utils/get-url-params';
import getDataParams from './utils/get-data-params';
import getQueryParams from './utils/get-query-params';
import getDefaultShowParams from './utils/get-default-show-params';
import getDefaultIndexParams from './utils/get-default-index-params';

import type Controller from '../../controller';
import type { Params$opts } from './interfaces';

/**
 * @private
 */
export function paramsFor({
  method,
  controller,
  dynamicSegments
}: Params$opts) {
  let params = getURLParams(dynamicSegments);

  switch (method) {
    case 'GET':
      params = [
        ...params,
        ...getQueryParams(controller)
      ];
      break;

    case 'POST':
      params = [
        ...params,
        getDataParams(controller, false)
      ];
      break;

    case 'PATCH':
      params = [
        ...params,
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
  switch (action) {
    case 'index':
      return getDefaultIndexParams(controller);

    case 'show':
      return getDefaultShowParams(controller);

    default:
      return {};
  }
}

export { default as validateResourceId } from './utils/validate-resource-id';

export type { ParameterLike, ParameterLike$opts } from './interfaces';
export type { default as Parameter } from './parameter';
export type { default as ParameterGroup } from './parameter-group';
