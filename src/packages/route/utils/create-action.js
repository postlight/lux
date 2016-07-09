// @flow
import { Model, Query } from '../../database';

import sanitizeParams from '../middleware/sanitize-params';
import setInclude from '../middleware/set-include';
import setFields from '../middleware/set-fields';
import setPage from '../middleware/set-page';

import insert from '../../../utils/insert';
import createPageLinks from './create-page-links';

import type Controller from '../../controller';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * @private
 */
export default function createAction(
  controller: Controller,
  action: () => Promise<mixed>
): Array<Function> {
  const { middleware, serializer } = controller;

  const builtIns = [
    sanitizeParams,
    setInclude,
    setFields,
    setPage
  ];

  const handlers = new Array(builtIns.length + middleware.length + 1);

  insert(handlers, [
    ...builtIns,
    ...middleware,

    async function actionHandler(
      req: IncomingMessage,
      res: ServerResponse
    ): mixed {
      const { defaultPerPage } = controller;

      const {
        route,
        headers,

        url: {
          path,
          query,
          pathname
        },

        params: {
          page,
          include
        }
      } = req;

      const domain = `http://${headers.get('host')}`;

      let total;
      let { params: { fields } } = req;
      let data = Reflect.apply(action, controller, [req, res]);
      let links = { self: domain + pathname };

      if (route && route.action === 'index') {
        [data, total] = await Promise.all([
          data,
          Query.from(data).count()
        ]);

        if (Array.isArray(data)) {
          links = {
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

          return serializer.format({
            data,
            links,
            domain,
            fields,
            include
          });
        }
      } else {
        data = await data;

        if (data instanceof Model) {
          if (!fields.length) {
            fields = controller.attributes;
          }

          return serializer.format({
            data,
            links,
            domain,
            fields,
            include
          });
        }
      }

      return data;
    }
  ].map((handler: Function): Function => {
    return (req: IncomingMessage, res: ServerResponse) => {
      return Reflect.apply(handler, controller, [req, res]);
    };
  }));

  Object.freeze(handlers);

  return handlers;
}
