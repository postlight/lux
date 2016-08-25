// @flow
import { Model, Query } from '../../../../database';
import { getDomain } from '../../../../server';

import createPageLinks from '../utils/create-page-links';

import type { Action } from '../interfaces';

/**
* @private
*/
export default function resource(action: Action<any>): Action<any> {
  return async function resourceAction(req, res) {
    const { route: { action: actionName } } = req;
    const result = action(req, res);
    let data;
    let total;

    if (actionName == 'index') {
      [data, total] = await Promise.all([
        result,
        new Promise((resolve, reject) => {
          Query.from(result).count().then(resolve, reject);
        })
      ]);
    } else {
      data = await result;
    }

    if (Array.isArray(data) || data instanceof Model) {
      const domain = getDomain(req);

      const {
        params,

        url: {
          path,
          pathname
        },

        route: {
          controller: {
            serializer,
            defaultPerPage
          }
        }
      } = req;

      if (actionName === 'index') {
        return await serializer.format({
          data,
          domain,
          include: params.include || [],

          links: createPageLinks({
            params,
            domain,
            pathname,
            defaultPerPage,
            total: total || 0
          })
        });
      } else {
        return await serializer.format({
          data,
          domain,
          include: params.include || [],

          links: {
            self: `${domain}${path}`
          }
        });
      }
    }

    return data;
  };
}
