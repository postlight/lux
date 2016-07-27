// @flow
import { Query } from '../../../database';
import { getDomain } from '../../../server';

import createPageLinks from '../utils/create-page-links';

import type { Model } from '../../../database';
import type { JSONAPI$Document } from '../../../jsonapi';
import type { Action } from '../interfaces';

/**
 * @private
 */
export default function collection(
  action: Action<Array<Model>>
): Action<JSONAPI$Document> {
  return async function collectionAction(req, res) {
    const {
      params,

      url: {
        pathname
      },

      route: {
        controller: {
          serializer,
          defaultPerPage
        }
      }
    } = req;

    const result = action(req, res);
    const domain = getDomain(req);
    let { page } = params;

    if (!page) {
      page = req.defaultParams.page;
    }

    const [data, total] = await Promise.all([
      result,
      Query.from(result).count()
    ]);

    return await serializer.format({
      data,
      domain,
      include: params.include || [],

      links: createPageLinks({
        total,
        params,
        domain,
        pathname,
        defaultPerPage
      })
    });
  };
}
