// @flow
import getDomain from '../utils/get-domain';

import type { Model } from '../../../database';
import type { Action } from '../interfaces';

/**
 * @private
 */
export default function member(action: Action<?Model>): Action<?Object> {
  return async function memberAction(req, res): Promise<?Object> {
    const data = await action(req, res);

    if (data) {
      const domain = getDomain(req);

      const {
        url: {
          path
        },

        params: {
          include = []
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
        include,

        links: {
          self: `${domain}${path}`
        }
      });
    }
  };
}
