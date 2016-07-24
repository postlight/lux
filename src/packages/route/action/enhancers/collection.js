// @flow
import { Query } from '../../../database';

import getDomain from '../utils/get-domain';
import createPageLinks from '../utils/create-page-links';

import type { Model } from '../../../database';
import type { Action } from '../interfaces';

export default function collection(
  action: Action<Array<Model>>
): Action<Array<Object>> {
  return async function collectionAction(req, res): Promise<Array<Object>> {
    const { route: { controller } } = req;
    const result = action(req, res);

    const [data, total] = await Promise.all([
      result,
      Query.from(result).count()
    ]);

    const domain = getDomain(req);
    const { serializer, defaultPerPage } = controller;

    const {
      params: {
        page = req.defaultParams.page,
        include = []
      },

      url: {
        path,
        query,
        pathname
      }
    } = req;

    const links = {
      self: domain + path,

      ...createPageLinks({
        page,
        total,
        query,
        domain,
        pathname,
        defaultPerPage
      })
    };

    return await serializer.format({
      data,
      links,
      domain,
      include
    });
  };
}
