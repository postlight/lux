// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import { defaultParamsFor } from '../index';

import setType from '../../../../../utils/set-type';
import { getTestApp } from '../../../../../../test/utils/get-test-app';

import type Controller from '../../../../controller';

describe('module "router/route/params"', () => {
  describe('#defaultParamsFor()', () => {
    let controller: Controller;

    before(async () => {
      const { controllers } = await getTestApp();

      controller = setType(() => controllers.get('posts'));
    });

    describe('with collection route', () => {
      let params;

      before(() => {
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
      let params: Object;

      before(() => {
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
  });
});
