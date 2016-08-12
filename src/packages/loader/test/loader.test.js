// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import { FreezeableMap } from '../../freezeable';
import loader from '../index';

import { getTestApp } from '../../../../test/utils/get-test-app';

import type Application from '../../application';

describe('loader', () => {
  let app: Application;

  before(async () => {
    app = await getTestApp();
  });

  describe('#loader()', () => {
    it('can load an Application', () => {
      expect(loader(app.path, 'application')).to.be.equal(app.constructor);
    });

    it('can load a config object', () => {
      expect(loader(app.path, 'config')).to.be.an.object;
    });

    it('can load Controllers', () => {
      const result = loader(app.path, 'controllers');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(Reflect.getPrototypeOf(value).name).to.equal('Controller');
      });
    });

    it('can load Migrations', () => {
      const result = loader(app.path, 'migrations');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(value.constructor.name).to.equal('Migration');
      });
    });

    it('can load Models', () => {
      const result = loader(app.path, 'models');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(Reflect.getPrototypeOf(value).name).to.equal('Model');
      });
    });

    it('can load a routes function', () => {
      expect(loader(app.path, 'routes')).to.be.a('function');
    });

    it('can load a database seed function', () => {
      expect(loader(app.path, 'seed')).to.be.a('function');
    });

    it('can load Serializers', () => {
      const result = loader(app.path, 'serializers');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(Reflect.getPrototypeOf(value).name).to.equal('Serializer');
      });
    });
  });
});
