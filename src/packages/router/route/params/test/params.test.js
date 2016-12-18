// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import { paramsFor, defaultParamsFor } from '../index';

import { getTestApp } from '../../../../../../test/utils/get-test-app';

import type Controller from '../../../../controller';

describe('module "router/route/params"', () => {
  describe('#paramsFor()', () => {
    let getController;

    before(async () => {
      const { controllers } = await getTestApp();

      // $FlowIgnore
      getController = (name: string): Controller => controllers.get(name);
    });

    describe('with model-less controller', () => {
      let params;

      before(() => {
        params = paramsFor({
          type: 'custom',
          method: 'GET',
          controller: getController('custom'),
          dynamicSegments: []
        });
      });

      it('contains query', () => {
        expect(params.has('userId')).to.be.true;
      });
    });
  });

  describe('#defaultParamsFor()', () => {
    let getController;

    before(async () => {
      const { controllers } = await getTestApp();

      // $FlowIgnore
      getController = (name: string): Controller => controllers.get(name);
    });

    describe('with collection route', () => {
      let params;
      let controller;

      before(() => {
        controller = getController('posts');
        params = defaultParamsFor({
          controller,
          type: 'collection'
        });
      });

      it('contains sort', () => {
        expect(params).to.include.keys('sort');
      });

      it('contains page cursor', () => {
        expect(params).to.include.keys('page');
        expect(params.page).to.include.keys('size', 'number');
      });

      it('contains model fields', () => {
        const { model, serializer: { attributes } } = controller;

        expect(params.fields).to.include.keys(model.resourceName);
        expect(params.fields[model.resourceName]).to.deep.equal(attributes);
      });
    });

    describe('with member route', () => {
      let params;
      let controller;

      before(() => {
        controller = getController('posts');
        params = defaultParamsFor({
          controller,
          type: 'member'
        });
      });

      it('contains model fields', () => {
        const { model, serializer: { attributes } } = controller;

        expect(params.fields).to.include.keys(model.resourceName);
        expect(params.fields[model.resourceName]).to.deep.equal(attributes);
      });
    });

    describe('with custom route', () => {
      let params;

      before(() => {
        params = defaultParamsFor({
          type: 'custom',
          controller: getController('posts')
        });
      });

      it('is an empty object literal', () => {
        expect(params).to.deep.equal({});
      });
    });

    describe('with model-less controller', () => {
      let params;

      before(() => {
        params = defaultParamsFor({
          type: 'custom',
          controller: getController('health')
        });
      });

      it('is an empty object literal', () => {
        expect(params).to.deep.equal({});
      });
    });
  });
});
