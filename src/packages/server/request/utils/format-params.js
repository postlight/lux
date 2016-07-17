import moment from 'moment';
import { camelize } from 'inflection';

import { INT, BOOL, DATE, DASH, TRUE, HAS_BODY } from '../constants';

import bodyParser from './body-parser';

import entries from '../../../../utils/entries';
import { camelizeKeys } from '../../../../utils/transform-keys';

function format(params, method = 'GET') {
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
              value = moment(value).toDate();
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

export default async function formatParams(req) {
  const { method, url: { query } } = req;
  const pattern = /^(.+)\[(.+)\]$/g;
  let params = Object.assign({ data: { attributes: {} } }, query);

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

  if (HAS_BODY.test(method)) {
    params = {
      ...params,
      ...(await bodyParser(req))
    };
  }

  return format(params, method);
}
