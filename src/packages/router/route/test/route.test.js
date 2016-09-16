// @flow

import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import Route from '../index';

import setType from '../../../../utils/set-type';
import { getTestApp } from '../../../../../test/utils/get-test-app';

import type Controller from '../../../controller';

describe('module "router/route"', () => {
  describe('class Route', () => {
    let staticRoute: Route;
    let dynamicRoute: Route;
    let dataRoute: Route;

    before(async () => {
      const { controllers } = await getTestApp();
      const controller: Controller = setType(() => controllers.get('posts'));

      staticRoute = new Route({
        controller,
        type: 'collection',
        path: 'posts',
        action: 'index',
        method: 'GET',
      });
      dynamicRoute = new Route({
        controller,
        type: 'member',
        path: 'posts/:id',
        action: 'show',
        method: 'GET',
      });
      dataRoute = new Route({
        controller,
        type: 'member',
        path: 'posts/:id',
        action: 'create',
        method: 'PATCH',
      });
    });

    describe('#parseParams()', () => {
      it('is empty for static paths', () => {
        expect(staticRoute.parseParams('/posts/1')).to.be.empty;
      });

      it('contains params matching dynamic segments', () => {
        expect(dynamicRoute.parseParams('/posts/1')).to.deep.equal({ id: 1 });
      });

      it('does not contain params for unmatched dynamic segments', () => {
        expect(dynamicRoute.parseParams('/posts/1/2')).to.deep.equal({ id: 1 });
      });
    });

    describe('#getDefaultParams()', () => {
      describe('with collection route', () => {
        let params: Object;

        before(() => {
          params = staticRoute.getDefaultParams();
        });

        it('contains sort', () => {
          expect(params).to.include.keys('sort');
        });

        it('contains page cursor', () => {
          expect(params).to.include.keys('page');
          expect(params.page).to.include.keys('size', 'number');
        });

        it('contains model fields', () => {
          const { controller: { attributes, model } } = staticRoute;
          expect(params.fields).to.include.keys(model.resourceName);
          expect(params.fields[model.resourceName]).to.deep.equal(attributes);
        });
      });

      describe('with member route', () => {
        let params: Object;

        before(() => {
          params = dynamicRoute.getDefaultParams();
        });

        it('contains model fields', () => {
          const { controller: { attributes, model } } = staticRoute;
          expect(params.fields).to.include.keys(model.resourceName);
          expect(params.fields[model.resourceName]).to.deep.equal(attributes);
        });
      });

      describe('with data route', () => {
        let params: Object;

        before(() => {
          params = dynamicRoute.getDefaultParams();
        });

        it('contains model fields', () => {
          const { controller: { attributes, model } } = dataRoute;
          expect(params.fields).to.include.keys(model.resourceName);
          expect(params.fields[model.resourceName]).to.deep.equal(attributes);
        });
      });
    });
  });
});
