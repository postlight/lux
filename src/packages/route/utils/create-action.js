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

const BUILT_INS = [
  sanitizeParams,
  setInclude,
  setFields,
  setPage
];

const { length: BUILT_INS_LENGTH } = BUILT_INS;

/**
 * @private
 */
export default function createAction(
  controller: Controller,
  action: () => Promise<mixed>
): Array<Function> {
  const {
    middleware,
    serializer,

    constructor: {
      name: controllerName
    }
  } = controller;

  const handlers = new Array(BUILT_INS_LENGTH + middleware.length + 1);

  insert(handlers, [
    ...BUILT_INS,
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
        },

        connection: {
          encrypted
        }
      } = req;

      const protocol = encrypted ? 'https' : 'http';
      const domain = `${protocol}://${headers.get('host')}`;

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
  ].map((handler: Function, idx, arr): Function => {
    return async (req: IncomingMessage, res: ServerResponse) => {
      const start = Date.now();
      const result = await Reflect.apply(handler, controller, [req, res]);

      if (idx > BUILT_INS_LENGTH - 1) {
        let { name: actionName } = handler;
        let actionType = 'middleware';

        if (idx === arr.length - 1) {
          actionType = 'action';

          if (req.route) {
            actionName = req.route.action;
          }
        }

        if (!actionName) {
          actionName = 'anonymous';
        }

        res.stats.push({
          type: actionType,
          name: actionName,
          duration: Date.now() - start,
          controller: controllerName
        });
      }

      return result;
    };
  }));

  Object.freeze(handlers);

  return handlers;
}
