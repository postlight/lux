// @flow
import { camelize, dasherize } from 'inflection';

import entries from './entries';
import underscore from './underscore';

/**
 * @private
 */
export default function transformKeys(
  obj: Object | Array<mixed>,
  transformer: (key: string) => string,
  deep: boolean = false
): Object | Array<mixed> {
  if (Array.isArray(obj)) {
    return obj.slice(0);
  } else if (obj && typeof obj === 'object') {
    return entries(obj)
      .reduce((result, [key, value]) => {
        if (deep && value && typeof value === 'object'
            && !Array.isArray(value)) {
          value = transformKeys(value, transformer, true);
        }

        return {
          ...result,
          [transformer(key)]: value
        };
      }, {});
  } else {
    return {};
  }
}

/**
 * @private
 */
export function camelizeKeys(
  obj: Object | Array<mixed>,
  deep?: boolean
): Object | Array<mixed> {
  return transformKeys(obj, (key) => camelize(underscore(key), true), deep);
}

/**
 * @private
 */
export function dasherizeKeys(
  obj: Object | Array<mixed>,
  deep?: boolean
): Object | Array<mixed> {
  return transformKeys(obj, (key) => dasherize(underscore(key), true), deep);
}

/**
 * @private
 */
export function underscoreKeys(
  obj: Object | Array<mixed>,
  deep?: boolean
): Object | Array<mixed> {
  return transformKeys(obj, (key) => underscore(key), deep);
}
