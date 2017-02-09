// @flow
import { Query } from '../../../../database';
import { getDomain } from '../../../../server';
import createPageLinks from '../utils/create-page-links';
import type { Action } from '../interfaces';

/**
* @private
*/
export default function resource(action: Action<any>): Action<any> {
  // eslint-disable-next-line func-names
  const resourceAction = function (req, res) {
    const isIndex = req.route.action === 'index';

    const init = [
      action(req, res),
      Promise.resolve(0)
    ];

    if (isIndex && init[0] instanceof Query) {
      init[1] = Query.from(init[0]).count();
    }

    return Promise
      .all(init)
      .then(([data, total]) => {
        if (Array.isArray(data) || (data && data.isModelInstance)) {
          const domain = getDomain(req);
          let links = {};

          const {
            params,
            url: {
              path,
              pathname
            },
            route: {
              controller: {
                namespace,
                serializer,
                defaultPerPage
              }
            }
          } = req;

          if (isIndex) {
            links = createPageLinks({
              params,
              domain,
              pathname,
              defaultPerPage,
              total: total || 0
            });
          } else if (namespace) {
            links = {
              self: domain.replace(`/${namespace}`, '') + path
            };
          } else {
            links = {
              self: domain + path
            };
          }

          return serializer.format({
            data,
            links,
            domain,
            include: params.include || []
          });
        }

        return data;
      });
  };

  Object.defineProperty(resourceAction, 'name', {
    value: action.name
  });

  return resourceAction;
}
