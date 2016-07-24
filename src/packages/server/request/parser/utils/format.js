// @flow
import { camelize } from 'inflection';

import { INT, BOOL, DATE, TRUE, BRACKETS } from '../constants';

import entries from '../../../../../utils/entries';
import underscore from '../../../../../utils/underscore';
import { camelizeKeys } from '../../../../../utils/transform-keys';

import type { Request$method } from '../../interfaces';

function makeArray(source: string | Array<string>): Array<string> {
  if (!Array.isArray(source)) {
    return source.includes(',') ? source.split(',') : [source];
  }

  return source;
}

function formatString(source: string, method: Request$method): mixed {
  let result = source;

  if (method === 'GET' && source.indexOf(',') >= 0) {
    result = source.split(',').map(str => camelize(underscore(str), true));
  } else {
    if (INT.test(source)) {
      result = parseInt(source, 10);
    } else if (BOOL.test(source)) {
      result = TRUE.test(source);
    } else if (DATE.test(source)) {
      result = new Date(source);
    }
  }

  return result;
}

function formatObject(
  source: Object | Array<any>,
  method: Request$method
): Object | Array<any> {
  if (Array.isArray(source)) {
    return source.map(value => INT.test(value) ? parseInt(value, 10) : value);
  } else {
    return format(source, method);
  }
}

export function formatSort(sort: string): string {
  let result = '';

  if (sort.startsWith('-')) {
    sort = sort.substr(1);
    result += '-';
  }

  result += camelize(underscore(sort), true);

  return result;
}

export function formatFields(fields: Object): Object {
  return entries(fields).reduce((result, [key, value]) => ({
    ...result,
    [key]: makeArray(value)
  }), {});
}

export function formatInclude(include: string | Array<string>): Array<string> {
  return makeArray(include);
}

export default function format(params: Object, method: Request$method): Object {
  const result = entries(params).reduce((obj, [key, value]) => {
    key = key.replace(BRACKETS, '');

    if (value) {
      switch (typeof value) {
        case 'object':
          value = formatObject(value, method);
          break;

        case 'string':
          value = formatString(value, method);
          break;
      }
    }

    return {
      ...obj,
      [key]: value
    };
  }, {});

  return camelizeKeys(result, true);
}
