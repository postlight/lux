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
  const resourceAction = async function (req, res) {
    const { route: { action: actionName } } = req;
    const result = action(req, res);
    let links = {};
    let data;
    let total;

    if (actionName === 'index') {
      [data, total] = await Promise.all([
        result,
        Query.from(result).count()
      ]);
    } else {
      data = await result;
    }

    if (Array.isArray(data) || (data && data.isModelInstance)) {
      const domain = getDomain(req);

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

      const include = params.include || [];

      if (actionName === 'index') {
        links = createPageLinks({
          params,
          domain,
          pathname,
          defaultPerPage,
          total: total || 0
        });
      } else if (actionName !== 'index' && namespace) {
        links = {
          self: domain.replace(`/${namespace}`, '') + path
        };
      } else if (actionName !== 'index' && !namespace) {
        links = {
          self: domain + path
        };
      }

      return await serializer.format({
        data,
        links,
        domain,
        include
      });
    }

    return data;
  };

  Reflect.defineProperty(resourceAction, 'name', {
    value: action.name
  });

  return resourceAction;
}
