// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import { FreezeableMap } from '../../freezeable';
import { createLoader } from '../index';

import { getTestApp } from '../../../../test/utils/get-test-app';

import type Application from '../../application';
import type { Loader } from '../index';

describe('module "loader"', () => {
  let app: Application;

  before(async () => {
    app = await getTestApp();
  });

  describe('#createLoader()', () => {
    let subject: Loader;

    before(() => {
      subject = createLoader(app.path);
    });

    it('can create a loader function', () => {
      expect(subject).to.be.a('function').and.have.lengthOf(1);
    });

    it('can load an Application', () => {
      expect(subject('application')).to.be.equal(app.constructor);
    });

    it('can load a config object', () => {
      expect(subject('config')).to.be.an.object;
    });

    it('can load Controllers', () => {
      const result = subject('controllers');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(
          Object.getPrototypeOf(value).name.endsWith('Controller')
        ).to.be.true;
      });
    });

    it('can load Migrations', () => {
      const result = subject('migrations');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(value.constructor.name).to.equal('Migration');
      });
    });

    it('can load Models', () => {
      const result = subject('models');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(Object.getPrototypeOf(value).name).to.equal('Model');
      });
    });

    it('can load a routes function', () => {
      expect(subject('routes')).to.be.a('function');
    });

    it('can load a database seed function', () => {
      expect(subject('seed')).to.be.a('function');
    });

    it('can load Serializers', () => {
      const result = subject('serializers');

      expect(result).to.be.an.instanceof(FreezeableMap);

      result.forEach(value => {
        expect(
          Object.getPrototypeOf(value).name.endsWith('Serializer')
        ).to.be.true;
      });
    });
  });
});
