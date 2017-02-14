// @flow
import { spy } from 'sinon';


import Model from '../model';
import {
  createTransactionResultProxy,
  createStaticTransactionProxy,
  createInstanceTransactionProxy
} from '../transaction';

import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/transaction"', () => {
  class Subject extends Model {
    static tableName = 'posts';
  }

  beforeAll(async () => {
    const { store } = await getTestApp();

    await Subject.initialize(store, () => {
      return store.connection(Subject.tableName);
    });
  });

  describe('.createTransactionResultProxy()', () => {
    it('has a #didPersist property', () => {
      const proxy = createTransactionResultProxy(new Subject(), true);

      expect(proxy.didPersist).toBe(true);
    });
  });

  describe('.createStaticTransactionProxy()', () => {
    describe(`#create()`, () => {
      let instance: Subject;
      let createSpy;

      beforeAll(async () => {
        createSpy = spy(Subject, 'create');
      });

      afterAll(async () => {
        createSpy.restore();

        if (instance) {
          await instance.destroy();
        }
      });

      it('calls create on the model with the trx object', async () => {
        let args = [{}];

        await Subject.transaction(trx => {
          args.push(trx);
          return createStaticTransactionProxy(Subject, trx).create(args[0]);
        });

        expect(createSpy.calledWith(...args)).toBe(true);
      });
    });
  });

  describe('.createInstanceTransactionProxy()', () => {
    ['save', 'update', 'destroy'].forEach(method => {
      describe(`#${method}()`, () => {
        let instance: Subject;
        let methodSpy;

        beforeAll(async () => {
          await Subject.create().then(proxy => {
            instance = proxy.unwrap();
            methodSpy = spy(instance, method);
          });
        });

        afterAll(async () => {
          methodSpy.restore();

          if (method !== 'destroy') {
            await instance.destroy();
          }
        });

        it(`calls ${method} on the instance with the trx object`, async () => {
          const obj = {};
          let args = [];

          await instance.transaction(trx => {
            const proxied = createInstanceTransactionProxy(instance, trx);
            let promise = Promise.resolve(instance);

            switch (method) {
              case 'save':
                promise = proxied.save();
                break;

              case 'update':
                args.push(obj);
                promise = proxied.update(obj);
                break;

              case 'destroy':
                promise = proxied.destroy();
                break;
            }

            args.push(trx);

            return promise;
          });

          expect(methodSpy.calledWith(...args)).toBe(true);
        });
      });
    });
  });
});
