// @flow
import { Model } from '../../../database';
import { getDomain } from '../../../server';

import type { Action } from '../interfaces';

/**
 * @private
 */
export default function member(action: Action<mixed>): Action<mixed> {
  return async function memberAction(req, res) {
    const data = await action(req, res);

    if (data && data instanceof Model) {
      const domain = getDomain(req);

      const {
        params,

        url: {
          path
        },

        route: {
          controller: {
            serializer
          }
        }
      } = req;

      return await serializer.format({
        data,
        domain,
        include: params.include || [],

        links: {
          self: `${domain}${path}`
        }
      });
    }

    return data;
  };
}
