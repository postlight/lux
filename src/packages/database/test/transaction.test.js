// @flow
import Model from '../model';
import {
  createTransactionResultProxy,
  createStaticTransactionProxy,
  createInstanceTransactionProxy
} from '../transaction';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/transaction"', () => {
  const tableName = 'posts';

  // $FlowIgnore
  class Subject extends Model {
    static tableName = tableName;
  }

  beforeAll(async () => {
    const { store } = await getTestApp();

    await Subject.initialize(
      store,
      () => store.connection(tableName)
    );
  });

  describe('.createTransactionResultProxy()', () => {
    it('has a #didPersist property', () => {
      const proxy = createTransactionResultProxy(new Subject(), true);

      expect(proxy.didPersist).toBe(true);
    });
  });

  describe('.createStaticTransactionProxy()', () => {
    describe('#create()', () => {
      const { create } = Subject;
      let mockCreate;
      let instance;

      beforeAll(async () => {
        mockCreate = jest.fn().mockImplementation((...args) => (
          create.apply(Subject, args)
        ));

        Subject.create = mockCreate;
      });

      afterAll(() => {
        Subject.create = create;
      });

      afterEach(async () => {
        mockCreate.mockClear();

        if (instance) {
          await instance.destroy();
        }
      });

      it('calls create on the model with the trx object', async () => {
        const args = [{}];

        await Subject.transaction(trx => {
          args.push(trx);
          return createStaticTransactionProxy(Subject, trx).create(args[0]);
        });

        expect(mockCreate).toBeCalledWith(...args);
      });
    });
  });

  describe('.createInstanceTransactionProxy()', () => {
    ['save', 'update', 'destroy'].forEach(method => {
      describe(`#${method}()`, () => {
        let instance;
        let ogMethod;
        let mockMethod;

        beforeAll(async () => {
          await Subject.create().then(proxy => {
            // $FlowIgnore
            instance = proxy.unwrap();
            ogMethod = instance[method];

            mockMethod = jest.fn().mockImplementation((...args) => (
              ogMethod.apply(instance, args)
            ));

            instance[method] = mockMethod;
          });
        });

        afterAll(() => {
          instance[method] = ogMethod;
        });

        afterEach(async () => {
          mockMethod.mockReset();

          if (method !== 'destroy') {
            await instance.destroy();
          }
        });

        it(`calls ${method} on the instance with the trx object`, async () => {
          const obj = {};
          const args = [];

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

              default:
                promise = proxied.destroy();
                break;
            }

            args.push(trx);

            return promise;
          });

          expect(mockMethod).toBeCalledWith(...args);
        });
      });
    });
  });
});
