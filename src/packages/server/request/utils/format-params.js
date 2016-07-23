// @flow
import { camelize } from 'inflection';

import { INT, BOOL, DATE, DASH, TRUE, HAS_BODY } from '../constants';

import bodyParser from './body-parser';
import isJSONAPI from './is-jsonapi';

import entries from '../../../../utils/entries';
import { camelizeKeys } from '../../../../utils/transform-keys';

import type { Request$params } from '../interfaces';

function format(params: Object, method: string = 'GET'): Object {
  params = entries(params).reduce((result, [key, value]) => {
    key = key.replace(/(\[\])/g, '');

    if (value) {
      switch (typeof value) {
        case 'object':
          if (Array.isArray(value)) {
            value = value.map(v => INT.test(v) ? parseInt(v, 10) : v);
          } else {
            value = format(value, method);
          }
          break;

        case 'string':
          if (method === 'GET' && value.indexOf(',') >= 0) {
            value = value.split(',').map(v => {
              return camelize(v.replace(DASH, '_'), true);
            });
          } else {
            if (INT.test(value)) {
              value = parseInt(value, 10);
            } else if (BOOL.test(value)) {
              value = TRUE.test(value);
            } else if (DATE.test(value)) {
              value = new Date(value);
            }
          }
          break;
      }
    }

    return {
      ...result,
      [key]: value
    };
  }, {});

  return camelizeKeys(params, true);
}

export default async function formatParams(
  req: Object
): Promise<Request$params> {
  const { method, url: { query } } = req;
  const pattern = /^(.+)\[(.+)\]$/g;
  let params = { ...query };

  params = entries(params).reduce((result, [key, value]) => {
    if (pattern.test(key)) {
      const parentKey = key.replace(pattern, '$1');
      const parentValue = result[parentKey];

      return {
        ...result,

        [parentKey]: {
          ...(parentValue || {}),
          [key.replace(pattern, '$2')]: value
        }
      };
    } else {
      return {
        ...result,
        [key]: value
      };
    }
  }, {});

  if (HAS_BODY.test(method) && isJSONAPI(req)) {
    params = {
      ...params,
      ...(await bodyParser(req))
    };
  }

  return format(params, method);
}
