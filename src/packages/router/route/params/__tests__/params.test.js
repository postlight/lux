/* @flow */

import { paramsFor, defaultParamsFor } from '../index';
import { getTestApp } from '../../../../../../test/utils/test-app';
import type Controller from '../../../../controller';

describe('module "router/route/params"', () => {
  let app;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.destroy();
  });

  describe('#paramsFor()', () => {
    let getController;

    beforeAll(() => {
      // $FlowIgnore
      getController = (name: string): Controller => app.controllers.get(name);
    });

    describe('with model-less controller', () => {
      let params;

      beforeAll(() => {
        params = paramsFor({
          type: 'custom',
          method: 'GET',
          controller: getController('custom'),
          dynamicSegments: []
        });
      });

      it('contains query', () => {
        expect(params.has('userId')).toBe(true);
      });
    });
  });

  describe('#defaultParamsFor()', () => {
    let getController;

    beforeAll(() => {
      // $FlowIgnore
      getController = (name: string): Controller => app.controllers.get(name);
    });

    describe('with collection route', () => {
      let params;
      let controller;

      beforeAll(() => {
        controller = getController('posts');
        params = defaultParamsFor({
          controller,
          type: 'collection'
        });
      });

      it('contains sort', () => {
        expect(params).toEqual(
          expect.objectContaining({
            sort: expect.anything(),
          })
        );
      });

      it('contains page cursor', () => {
        expect(params).toEqual(
          expect.objectContaining({
            page: {
              size: expect.anything(),
              number: expect.anything(),
            },
          })
        );
      });

      it('contains model fields', () => {
        const { model, serializer: { attributes } } = controller;

        expect(params).toEqual(
          expect.objectContaining({
            fields: expect.objectContaining({
              [model.resourceName]: attributes,
            }),
          })
        );
      });
    });

    describe('with member route', () => {
      let params;
      let controller;

      beforeAll(() => {
        controller = getController('posts');
        params = defaultParamsFor({
          controller,
          type: 'member'
        });
      });

      it('contains model fields', () => {
        const { model, serializer: { attributes } } = controller;

        expect(params).toEqual(
          expect.objectContaining({
            fields: expect.objectContaining({
              [model.resourceName]: attributes,
            }),
          })
        );
      });
    });

    describe('with custom route', () => {
      let params;

      beforeAll(() => {
        params = defaultParamsFor({
          type: 'custom',
          controller: getController('posts')
        });
      });

      it('is an empty object literal', () => {
        expect(params).toEqual({});
      });
    });

    describe('with model-less controller', () => {
      let params;

      beforeAll(() => {
        params = defaultParamsFor({
          type: 'custom',
          controller: getController('health')
        });
      });

      it('is an empty object literal', () => {
        expect(params).toEqual({});
      });
    });
  });
});
