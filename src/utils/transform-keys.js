// @flow
import { camelize, dasherize } from 'inflection';

import entries from './entries';
import underscore from './underscore';

/**
 * @private
 */
export default function transformKeys(
  source: Object | Array<mixed>,
  transformer: (key: string) => string,
  deep: boolean = false
): any {
  if (Array.isArray(source)) {
    return source.slice(0);
  } else if (source && typeof source === 'object') {
    return entries(source).reduce((result, [key, value]) => {
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
export function camelizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => camelize(underscore(key), true), deep);
}

/**
 * @private
 */
export function dasherizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => dasherize(underscore(key), true), deep);
}

/**
 * @private
 */
export function underscoreKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean
): T {
  return transformKeys(source, key => underscore(key), deep);
}
