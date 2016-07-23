// @flow
import { Model, Query } from '../../database';

import merge from '../../../utils/merge';
import createPageLinks from './create-page-links';

import type Controller from '../../controller';
import type { Request, Response } from '../../server';
import type { Route$handler } from '../index';

/**
 * @private
 */
export default function createAction(
  controller: Controller,
  action: (req: Request, res: Response) => Promise<void | ?mixed>
): Array<Route$handler> {
  const {
    middleware,
    serializer,

    constructor: {
      name: controllerName
    }
  } = controller;

  return [
    ...middleware,

    async function actionHandler(req: Request, res: Response): Promise<mixed> {
      const { defaultPerPage } = controller;
      let { params } = req;

      const {
        route,
        headers,

        url: {
          path,
          query,
          pathname
        },

        connection: {
          encrypted
        }
      } = req;

      params = merge(req.defaultParams, params);

      const { page, include } = params;
      let { fields } = params;

      const protocol = encrypted ? 'https' : 'http';
      const domain = `${protocol}://${headers.get('host') || 'localhost'}`;

      let total;
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
  ].map((handler: Route$handler, idx, arr): Route$handler => {
    return async (req: Request, res: Response): Promise<void | ?mixed> => {
      const start = Date.now();
      const result = await Reflect.apply(handler, controller, [req, res]);

      if (idx > 0) {
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
  });
}
