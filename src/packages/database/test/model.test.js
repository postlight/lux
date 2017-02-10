// @flow
import { spy } from 'sinon';

import Model from '../model';
import Query, { RecordNotFoundError } from '../query';
import { ValidationError } from '../validation';

import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/model"', () => {
  describe('class Model', () => {
    let store;
    let User: Class<Model>;
    let Image: Class<Model>;
    let Comment: Class<Model>;

    beforeAll(async () => {
      const app = await getTestApp();

      store = app.store;
      User = app.models.get('user');
      Image = app.models.get('image');
      Comment = app.models.get('comment');
    });

    describe('.initialize()', () => {
      class Subject extends Model {
        static tableName = 'posts';

        static belongsTo = {
          user: {
            inverse: 'posts'
          }
        };

        static hasMany = {
          comments: {
            inverse: 'post'
          },

          reactions: {
            inverse: 'post',
            model: 'reaction'
          },

          tags: {
            inverse: 'posts',
            through: 'categorization'
          }
        };

        static hooks = {
          async afterCreate() {},
          async beforeDestroy() {},
          async duringDestroy() {}
          //    ^^^^^^^^^^^^^ This hook should be removed.
        };

        static scopes = {
          isPublic() {
            return this.where({
              isPublic: true
            });
          },

          isDraft() {
            return this.where({
              isPublic: false
            });
          }
        };

        static validates = {
          title: str => Boolean(str),
          notAFunction: {},
        //^^^^^^^^^^^^ This validation should be removed.
          notAnAttribute: () => false
        //^^^^^^^^^^^^^^ This validation should be removed.
        };
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('can be called repeatedly without error', async () => {
        const table = () => store.connection(Subject.tableName);

        const refs = await Promise.all([
          Subject.initialize(store, table),
          Subject.initialize(store, table),
          Subject.initialize(store, table)
        ]);

        refs.forEach(ref => {
          expect(ref).toBe(Subject);
        });
      });

      it('adds a `store` property to the `Model`', () => {
        expect(Subject.store).toBe(store);
      });

      it('adds a `table` property to the `Model`', () => {
        expect(typeof Subject.table).toBe('function');
      });

      it('adds a `logger` property to the `Model`', () => {
        expect(Subject.logger).toBe(store.logger);
      });

      it('adds an `attributes` property to the `Model`', () => {
        expect(Subject).toEqual(
          expect.objectContaining({
            attributes: [
              'id',
              'body',
              'title',
              'isPublic',
              'userId',
              'createdAt',
              'updatedAt'
            ]
          })
        );

        Object
          .keys(Subject.attributes)
          .forEach(key => {
            expect(Subject.attributes[key]).toEqual({
              type: expect.any(String),
              docName: expect.any(String),
              nullable: expect.anything(),
              maxLength: expect.anything(),
              columnName: expect.any(String),
              defaultValue: expect.anything(),
            });
          });
      });

      it('adds an `attributeNames` property to the `Model`', () => {
        expect(Subject.attributeNames).toEqual([
          'id',
          'body',
          'title',
          'isPublic',
          'userId',
          'createdAt',
          'updatedAt',
        ]);
      });

      it('adds attribute accessors on the `prototype`', () => {
        Object
          .keys(Subject.attributes)
          .forEach(key => {
            const desc = Reflect.getOwnPropertyDescriptor(Subject.prototype, key);

            expect(typeof desc.get).toBe('function');
            expect(typeof desc.set).toBe('function');
          });
      });

      it('adds a `hasOne` property to the `Model`', () => {
        expect(Subject.hasOne).toMatchSnapshot();
      });

      it('adds a `hasMany` property to the `Model`', () => {
        expect(Subject.hasMany).toMatchSnapshot();
      });

      it('adds a `belongsTo` property to the `Model`', () => {
        expect(Subject.belongsTo).toMatchSnapshot();
      });

      it('adds a `relationships` property to the `Model`', () => {
        expect(Subject.relationships).toMatchSnapshot();
      });

      it('adds a `relationshipNames` property to the `Model`', () => {
        expect(Subject.relationshipNames).toMatchSnapshot();
      });

      it('adds relationship accessors to the `prototype`', () => {
        expect(Subject.prototype).toEqual(
          expect.objectContaining({
            user: expect.objectContaining({
              get: expect.any(Function),
              set: expect.any(Function),
            }),
            tags: expect.objectContaining({
              get: expect.any(Function),
              set: expect.any(Function),
            }),
            comments: expect.objectContaining({
              get: expect.any(Function),
              set: expect.any(Function),
            }),
            reactions: expect.objectContaining({
              get: expect.any(Function),
              set: expect.any(Function),
            })
          })
        );
      });

      it('removes invalid hooks from the `hooks` property', () => {
        expect(Subject.hooks).toMatchSnapshot();
      });

      it('adds each scope to `Model`', () => {
        expect(Subject.scopes).toMatchSnapshot();
      });

      it('removes invalid validations from the `validates` property', () => {
        expect(Subject.validates).toMatchSnapshot();
      });

      it('adds a `modelName` property to the `Model`', () => {
        expect(Subject.modelName).toBe('subject');
      });

      it('adds a `modelName` property to the `prototype`', () => {
        expect(Subject).toEqual(
          expect.objectContaining({
            prototype: {
              modelName: 'subject',
            },
          })
        );
      });

      it('adds a `resourceName` property to the `Model`', () => {
        expect(Subject.resourceName).toBe('subjects');
      });

      it('adds a `resourceName` property to the `prototype`', () => {
        expect(Subject).toEqual(
          expect.objectContaining({
            prototype: {
              resourceName: 'subjects',
            },
          })
        );
      });

      it('adds an `initialized` property to the `Model`', () => {
        expect(Subject.initialized).toBe(true);
      });

      describe('- without `tableName`', () => {
        class Post extends Model {}

        beforeAll(async () => {
          await Post.initialize(store, () => {
            return store.connection(Post.tableName);
          });
        });

        it('adds a `tableName` property to the `prototype`', () => {
          expect(Post.tableName).toBe('posts');
        });

        it('adds a `tableName` property to the `prototype`', () => {
          expect(Post).toEqual(
            expect.objectContaining({
              prototype: {
                tableName: 'posts',
              },
            })
          );
        });
      });
    });

    describe('.create()', () => {
      let result: Subject;

      class Subject extends Model {
        static tableName = 'posts';

        static belongsTo = {
          user: {
            inverse: 'posts'
          }
        };
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      afterAll(async () => {
        await result.destroy();
      });

      it('constructs and persists a `Model` instance', async () => {
        const user = new User({ id: 1 });
        const body = 'Contents of "Test Post"...';
        const title = 'Test Post';

        result = await Subject.create({
          user,
          body,
          title,
          isPublic: true
        });

        result = result.unwrap();

        expect(result instanceof Subject).toBe(true);

        expect(result.id).toEqual(expect.any(Number));
        expect(result.body).toBe(body);
        expect(result.title).toBe(title);
        expect(result.isPublic).toBe(true);
        expect(result.createdAt).toEqual(expect.any(Date));
        expect(result.updatedAt).toEqual(expect.any(Date));

        expect(await result.user).to.have.property('id', user.getPrimaryKey());
      });
    });

    describe('.transacting()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns a static transaction proxy', async () => {
        await Subject.transaction(trx => {
          const proxy = Subject.transacting(trx);

          expect(proxy.create).toEqual(expect.any(Function));

          return Promise.resolve(new Subject());
        });
      });
    });

    describe('.all()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.all();

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.find()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.find();

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.page()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.page(1);

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.limit()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.limit(25);

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.offset()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.offset(0);

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.count()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.count();

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.order()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.order('createdAt', 'ASC');

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.where()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.where({
          isPublic: true
        });

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.not()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.not({
          isPublic: true
        });

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.first()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.first();

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.last()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.last();

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.select()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.select('title', 'createdAt');

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.distinct()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.distinct('title');

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.include()', () => {
      class Subject extends Model {
        static tableName = 'posts';

        static hasMany = {
          comments: {
            inverse: 'post'
          }
        };

        static belongsTo = {
          user: {
            inverse: 'posts'
          }
        };
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.include('user', 'comments');

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.unscope()', () => {
      class Subject extends Model {
        static tableName = 'posts';

        static scopes = {
          isPublic() {
            return this.where({
              isPublic: true
            });
          }
        };
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.unscope('isPublic');

        expect(result instanceof Query).toBe(true);
      });
    });

    describe('.hasScope()', () => {
      class Subject extends Model {
        static scopes = {
          mostRecent() {
            return this.order('createdAt', 'DESC');
          }
        };
      }

      it('returns true if a `Model` has a scope', () => {
        const result = Subject.hasScope('mostRecent');

        expect(result).toBe(true);
      });

      it('returns false if a `Model` does not have a scope', () => {
        const result = Subject.hasScope('mostPopular');

        expect(result).toBe(false);
      });
    });

    describe('.isInstance()', () => {
      class SubjectA extends Model {
        static tableName = 'posts';
      }

      class SubjectB extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Promise.all([
          SubjectA.initialize(store, () => {
            return store.connection(SubjectA.tableName);
          }),
          SubjectB.initialize(store, () => {
            return store.connection(SubjectB.tableName);
          })
        ]);
      });

      it('returns true if an object is an instance of the `Model`', () => {
        const instance = new SubjectA();
        const result = SubjectA.isInstance(instance);

        expect(result).toBe(true);
      });

      it('returns false if an object is an instance of the `Model`', () => {
        const instance = new SubjectA();
        const result = SubjectB.isInstance(instance);

        expect(result).toBe(false);
      });
    });

    describe('.columnFor()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns the column data for an attribute if it exists', () => {
        expect(Subject.columnFor('isPublic')).toMatchSnapshot();
      });
    });

    describe('.columnNameFor()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns the column name for an attribute if it exists', () => {
        const result = Subject.columnNameFor('isPublic');

        expect(result).toBe('is_public');
      });
    });

    describe('.relationshipFor()', () => {
      class Subject extends Model {
        static tableName = 'posts';

        static belongsTo = {
          user: {
            inverse: 'posts'
          }
        };
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns the data for a relationship if it exists', () => {
        expect(Subject.relationshipFor('user')).toMatchSnapshot();
      });
    });

    describe('.hooks', () => {
      const assertCreateHook = (instance: Model, hookSpy) => {
        expect(hookSpy.calledWith(instance)).toBe(true);
      };

      const assertSaveHook = async (instance: Model, hookSpy) => {
        hookSpy.reset();

        Reflect.set(instance, 'isPublic', true);
        await instance.save();

        expect(hookSpy.calledWith(instance)).toBe(true);
      };

      const assertUpdateHook = async (instance: Model, hookSpy) => {
        hookSpy.reset();

        await instance.update({
          isPublic: true
        });

        expect(hookSpy.calledWith(instance)).toBe(true);
      };

      const assertDestroyHook = async (instance: Model, hookSpy) => {
        await instance.destroy();
        expect(hookSpy.calledWith(instance)).toBe(true);
      };

      describe('.afterCreate()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async afterCreate() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'afterCreate');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });

          instance = await Subject.create({
            title: 'Test Hook (afterCreate)',
            isPublic: false
          });
        });

        afterAll(async () => {
          await instance.destroy();
          hookSpy.reset();
        });

        it('runs when .create() is called', () => {
          assertCreateHook(instance, hookSpy);
        });
      });

      describe('.afterDestroy()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          static tableName = 'posts';

          static hooks = {
            async afterDestroy() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'afterDestroy');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });

          instance = await Subject.create({
            title: 'Test Hook (afterDestroy)',
            isPublic: false
          });
        });

        it('runs when #destroy is called', async () => {
          await assertDestroyHook(instance, hookSpy);
        });
      });

      describe('.afterSave()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async afterSave() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'afterSave');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });
        });

        beforeEach(async () => {
          instance = await Subject.create({
            title: 'Test Hook (afterSave)',
            isPublic: false
          });
        });

        afterEach(async () => {
          await instance.destroy();
          hookSpy.reset();
        });

        it('runs when .create() is called', () => {
          assertCreateHook(instance, hookSpy);
        });

        it('runs when #save() is called', async () => {
          await assertSaveHook(instance, hookSpy);
        });

        it('runs when #update() is called', async () => {
          await assertUpdateHook(instance, hookSpy);
        });
      });

      describe('.afterUpdate()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async afterUpdate() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'afterUpdate');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });
        });

        beforeEach(async () => {
          instance = await Subject.create({
            title: 'Test Hook (afterUpdate)',
            isPublic: false
          });
        });

        afterEach(async () => {
          await instance.destroy();
          hookSpy.reset();
        });

        it('runs when #save() is called', async () => {
          await assertSaveHook(instance, hookSpy);
        });

        it('runs when #update() is called', async () => {
          await assertUpdateHook(instance, hookSpy);
        });
      });

      describe('.afterValidation()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async afterValidation() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'afterValidation');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });
        });

        beforeEach(async () => {
          instance = await Subject.create({
            title: 'Test Hook (afterValidation)',
            isPublic: false
          });
        });

        afterEach(async () => {
          await instance.destroy();
          hookSpy.reset();
        });

        it('runs when .create() is called', () => {
          assertCreateHook(instance, hookSpy);
        });

        it('runs when #save() is called', async () => {
          await assertSaveHook(instance, hookSpy);
        });

        it('runs when #update() is called', async () => {
          await assertUpdateHook(instance, hookSpy);
        });
      });

      describe('.beforeCreate()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async beforeCreate() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'beforeCreate');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });

          instance = await Subject.create({
            title: 'Test Hook (beforeCreate)',
            isPublic: false
          });
        });

        afterAll(async () => {
          await instance.destroy();
        });

        it('runs when .create() is called', () => {
          assertCreateHook(instance, hookSpy);
        });
      });

      describe('.beforeDestroy()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async beforeDestroy(record) {

            }
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'beforeDestroy');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });

          instance = await Subject.create({
            title: 'Test Hook (beforeDestroy)',
            isPublic: false
          });
        });

        afterAll(async () => {
          await instance.destroy();
        });

        it('runs when #destroy is called', async () => {
          await assertDestroyHook(instance, hookSpy);
        });
      });

      describe('.beforeSave()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async beforeSave() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'beforeSave');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });
        });

        beforeEach(async () => {
          instance = await Subject.create({
            title: 'Test Hook (beforeSave)',
            isPublic: false
          });
        });

        afterEach(async () => {
          await instance.destroy();
          hookSpy.reset();
        });

        it('runs when .create() is called', () => {
          assertCreateHook(instance, hookSpy);
        });

        it('runs when #save() is called', async () => {
          await assertSaveHook(instance, hookSpy);
        });

        it('runs when #update() is called', async () => {
          await assertUpdateHook(instance, hookSpy);
        });
      });

      describe('.beforeUpdate()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            beforeUpdate(record) {
              return Promise.resolve(record);
            }
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'beforeUpdate');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });
        });

        beforeEach(async () => {
          instance = await Subject.create({
            title: 'Test Hook (beforeUpdate)',
            isPublic: false
          });
        });

        afterEach(async () => {
          await instance.destroy();
          hookSpy.reset();
        });

        it('runs when #save() is called', async () => {
          await assertSaveHook(instance, hookSpy);
        });

        it('runs when #update() is called', async () => {
          await assertUpdateHook(instance, hookSpy);
        });
      });

      describe('.beforeValidation()', () => {
        let hookSpy;
        let instance;

        class Subject extends Model {
          isPublic: boolean;

          static tableName = 'posts';

          static hooks = {
            async beforeValidation() {}
          };
        }

        beforeAll(async () => {
          hookSpy = spy(Subject.hooks, 'beforeValidation');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });
        });

        beforeEach(async () => {
          instance = await Subject.create({
            title: 'Test Hook (beforeValidation)',
            isPublic: false
          });
        });

        afterEach(async () => {
          await instance.destroy();
          hookSpy.reset();
        });

        it('runs when .create() is called', () => {
          assertCreateHook(instance, hookSpy);
        });

        it('runs when #save() is called', async () => {
          await assertSaveHook(instance, hookSpy);
        });

        it('runs when #update() is called', async () => {
          await assertUpdateHook(instance, hookSpy);
        });
      });
    });

    describe('.attributes', () => {
      class Subject extends Model {
        body: void | ?string;
        title: string;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      describe('#set()', () => {
        const ogTitle = 'Test Attribute#set()';
        let instance;

        beforeEach(() => {
          instance = new Subject({
            title: ogTitle
          });
        });

        it('updates the current value', () => {
          const newVaue = 'It worked!';

          instance.body = newVaue;
          expect(instance.body).toBe(newVaue);
        });

        describe('- nullable', () => {
          it('sets the current value to null when passed null', () => {
            instance.body = null;
            expect(instance.body).toBe(null);
          });

          it('sets the current value to null when passed undefined', () => {
            instance.body = undefined;
            expect(instance.body).toBe(null);
          });
        });

        describe('- not nullable', () => {
          it('does not update the current value when passed null', () => {
            instance.title = null;
            expect(instance.title).toBe(ogTitle);
          });

          it('does not update the current value when passed undefined', () => {
            instance.title = undefined;
            expect(instance.title).toBe(ogTitle);
          });
        });
      });
    });

    describe('#save()', () => {
      const instances = new Set();
      let instance: Subject;

      class Subject extends Model {
        id: number;
        user: Model;
        title: string;
        isPublic: boolean;

        static tableName = 'posts';

        static hasMany = {
          comments: {
            inverse: 'posts',
            foreignKey: 'post_id'
          }
        };

        static belongsTo = {
          user: {
            inverse: 'posts'
          }
        };

        static validates = {
          title: str => str.split(' ').length > 1
        };
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      beforeEach(async () => {
        instance = await Subject.create({
          title: 'Test Post',
          isPublic: false
        });
      });

      afterEach(() => {
        return Subject.transaction(trx => (
          Promise.all([
            instance
              .transacting(trx)
              .destroy(),
            ...Array
              .from(instances)
              .map(record => (
                record
                  .transacting(trx)
                  .destroy()
                  .then(() => instances.delete(record))
              ))
          ])
        ));
      });

      it('can persist dirty attributes', async () => {
        instance.isPublic = true;
        await instance.save();

        expect(instance.isPublic).toBe(true);

        const result = await Subject.find(instance.id);

        expect(result.isPublic).toBe(true);
      });

      it('can persist dirty relationships', async () => {
        const userInstance = await User.create({
          name: 'Test User',
          email: 'test-user@postlight.com',
          password: 'test12345678'
        });

        instances.add(userInstance);

        instance.user = userInstance;
        await instance.save();

        const {
          rawColumnData: {
            user,
            userId
          }
        } = await Subject
          .find(instance.id)
          .include('user');

        expect(user).toEqual(expect.any(Object));
        expect(user.id).toBe(userId);
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test-user@postlight.com');
      });

      it('fails if a validation is not met', async () => {
        instance.title = 'Test';
        await instance.save().catch(err => {
          expect(err instanceof ValidationError).toBe(true);
        });

        expect(instance.title).toBe('Test');

        const result = await Subject.find(instance.id);

        expect(result.title).toBe('Test Post');
      });
    });

    describe('#update()', () => {
      let instance: Subject;

      class Subject extends Model {
        id: number;
        body: string;
        title: string;
        isPublic: boolean;

        static tableName = 'posts';

        static hasOne = {
          image: {
            inverse: 'post'
          }
        };

        static hasMany = {
          comments: {
            inverse: 'post'
          }
        };

        static belongsTo = {
          user: {
            inverse: 'posts'
          }
        };

        static validates = {
          title: str => str.split(' ').length > 1
        };
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      beforeEach(async () => {
        instance = await Subject.create({
          title: 'Test Post',
          isPublic: false
        });
      });

      afterEach(async () => {
        await instance.destroy();
      });

      it('can set and persist attributes and relationships', async () => {
        const body = 'Lots of content...';

        const user = new User({
          id: 1
        });

        const image = new Image({
          id: 1
        });

        const comments = [
          new Comment({
            id: 1
          }),
          new Comment({
            id: 2
          }),
          new Comment({
            id: 3
          })
        ];

        await instance.update({
          body,
          user,
          image,
          comments,
          isPublic: true
        });

        expect(instance.body).toBe(body);
        expect(instance.isPublic).toBe(true);

        expect(await instance.user)
          .to.have.property('id', user.getPrimaryKey());

        expect(await instance.image)
          .to.have.property('id', image.getPrimaryKey());

        expect(await instance.comments)
          .to.be.an('array')
          .with.lengthOf(3);

        const result = await Subject
          .find(instance.id)
          .include('user', 'image', 'comments');

        expect(result.body).toBe(body);
        expect(result.isPublic).toBe(true);

        expect(await result.user).toEqual(
          expect.objectContaining({
            id: user.getPrimaryKey(),
          })
        );

        expect(await result.image).toEqual(
          expect.objectContaining({
            id: image.getPrimaryKey(),
          })
        );

        expect(await result.comments).toEqual(expect.any(Array));
      });

      it('fails if a validation is not met', async () => {
        await instance
          .update({
            title: 'Test',
            isPublic: true,
          })
          .catch(err => {
            expect(err instanceof ValidationError).toBe(true);
          });

        expect(instance).toEqual(
          expect.objectContaining({
            title: 'Test',
            isPublic: true,
          })
        );

        const result = await Subject.find(instance.id);

        expect(result).toEqual(
          expect.objectContaining({
            title: 'Test Post',
            isPublic: true,
          })
        );
      });
    });

    describe('#destroy()', () => {
      let instance: Subject;

      class Subject extends Model {
        id: number;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          title: 'Test Post'
        });
      });

      afterAll(async () => {
        await instance.destroy();
      });

      it('removes the record from the database', async () => {
        await instance.destroy();
        await Subject.find(instance.id).catch(err => {
          expect(err instanceof RecordNotFoundError).toBe(true);
        });
      });
    });

    describe('#reload', () => {
      let instance: Subject;

      class Subject extends Model {
        title: string;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          body: 'Lots of content...',
          title: 'Test Post',
          isPublic: true
        });
      });

      afterAll(async () => {
        await instance.destroy();
      });

      it('reverts attributes to the last known persisted changes', async () => {
        const { title: prevTitle } = instance;
        const nextTitle = 'Testing #reload()';

        instance.title = nextTitle;

        const ref = await instance.reload();

        expect(ref).not.toBe(instance);
        expect(ref.title).toBe(prevTitle);
        expect(instance.title).toBe(nextTitle);
      });

      it('resolves with itself if the instance is new', async () => {
        const newInstance = new Subject();
        const nextTitle = 'Testing #reload()';

        newInstance.title = nextTitle;

        const ref = await newInstance.reload();

        expect(ref).toBe(newInstance);
        expect(ref.title).toBe(nextTitle);
      });
    });

    describe('#rollback', () => {
      let instance: Subject;

      class Subject extends Model {
        title: string;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          body: 'Lots of content...',
          title: 'Test Post',
          isPublic: true
        });
      });

      afterAll(async () => {
        await instance.destroy();
      });

      it('reverts attributes to the last known persisted changes', () => {
        const { title: prevTitle } = instance;
        const nextTitle = 'Testing #rollback()';

        instance.title = nextTitle;

        expect(instance.title).toBe(nextTitle);

        const ref = instance.rollback();

        expect(ref).toBe(instance);
        expect(instance.title).toBe(prevTitle);
      });
    });

    describe('#getAttributes()', () => {
      let instance: Subject;

      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          body: 'Lots of content...',
          title: 'Test Post',
          isPublic: true
        });
      });

      afterAll(async () => {
        await instance.destroy();
      });

      it('returns a pojo containing the requested attributes', () => {
        const result = instance.getAttributes('body', 'title');

        expect(result).toEqual({
          body: 'Lots of content...',
          title: 'Test Post'
        });
      });
    });

    describe('#getPrimaryKey()', () => {
      let instance: Subject;

      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          title: 'Test Post'
        });
      });

      afterAll(async () => {
        await instance.destroy();
      });

      it('returns the value of `instance[Model.primaryKey]`', () => {
        const result = instance.getPrimaryKey();

        expect(result).toEqual(expect.any(Number));
      });
    });

    describe('get #persisted()', () => {
      let instance;

      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns true for a record returned from querying', async () => {
        const record = await Subject.first();

        expect(record.persisted).toBe(true);
      });

      it('returns false if a record has been modified', async () => {
        const record = await Subject.first();

        record.title = 'Modified Title';

        expect(record.persisted).toBe(false);
      });

      it('returns false if the record is new', () => {
        const record = new Subject();

        expect(record.persisted).toBe(false);
      });
    });
  });
});
