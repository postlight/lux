// @flow
import qs from 'qs';

import isNull from '../../../../utils/is-null';
import entries from '../../../../utils/entries';

const INT = /^\d+$/;
const NULL = /^null$/;
const BOOL = /^(?:true|false)$/;
const DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{4})$/;
const TRUE = /^true$/;

type Params = {
  [key: string]: any;
};

const coerceString = (source: string): any => {
  if (INT.test(source)) {
    return Number.parseInt(source, 10);
  } else if (BOOL.test(source)) {
    return TRUE.test(source);
  } else if (NULL.test(source)) {
    return null;
  } else if (DATE.test(source)) {
    return new Date(source);
  }

  return source;
};

const coerceObject = (params: Object): Params => (
  entries(params).reduce((obj, [key, value]) => {
    const result = obj;

    if (typeof value === 'string') {
      result[key] = coerceString(value);
    } else if (typeof value === 'object' && !isNull(value)) {
      result[key] = coerceObject(value);
    } else {
      result[key] = value;
    }

    return result;
  }, {})
);

export const parse = (query: string | void): Params => (
  coerceObject(qs.parse(query))
);
