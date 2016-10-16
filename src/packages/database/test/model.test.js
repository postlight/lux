// @flow
import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe, before, after, beforeEach, afterEach } from 'mocha';

import Model from '../model';
import Query, { RecordNotFoundError } from '../query';
import { ValidationError } from '../validation';

import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/model"', () => {
  describe('class Model', () => {
    let store;
    let User: Class<Model>;

    before(async () => {
      const app = await getTestApp();

      store = app.store;
      User = setType(() => app.models.get('user'));
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
            inverse: 'post'
          },

          tags: {
            inverse: 'posts',
            through: 'categorization'
          }
        };

        static hooks = {
          afterCreate: async instance => console.log(instance),
          beforeDestroy: async instance => console.log(instance),
          duringDestroy: async () => console.log('This hook should be removed.')
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
          notAnAttribute: () => false
        };
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('adds a `store` property to the `Model`', () => {
        expect(Subject.store).to.equal(store);
      });

      it('adds a `table` property to the `Model`', () => {
        expect(Subject.table).to.be.a('function');
      });

      it('adds a `logger` property to the `Model`', () => {
        expect(Subject.logger).to.equal(store.logger);
      });

      it('adds an `attributes` property to the `Model`', () => {
        expect(Subject.attributes).to.have.all.keys([
          'id',
          'body',
          'title',
          'isPublic',
          'userId',
          'createdAt',
          'updatedAt'
        ]);

        Object.keys(Subject.attributes).forEach(key => {
          const value = Reflect.get(Subject.attributes, key);

          expect(value).to.have.all.keys([
            'type',
            'docName',
            'nullable',
            'maxLength',
            'columnName',
            'defaultValue'
          ]);
        });
      });

      it('adds an `attributeNames` property to the `Model`', () => {
        expect(Subject.attributeNames).to.include.all.members([
          'id',
          'body',
          'title',
          'isPublic',
          'userId',
          'createdAt',
          'updatedAt'
        ]);
      });

      it('adds attribute accessors on the `prototype`', () => {
        Object.keys(Subject.attributes).forEach(key => {
          const desc = Reflect.getOwnPropertyDescriptor(Subject.prototype, key);

          expect(desc).to.have.property('get').and.be.a('function');
          expect(desc).to.have.property('set').and.be.a('function');
        });
      });

      it('adds a `hasOne` property to the `Model`', () => {
        expect(Subject.hasOne).to.deep.equal({});
      });

      it('adds a `hasMany` property to the `Model`', () => {
        expect(Subject.hasMany).to.have.all.keys([
          'tags',
          'comments',
          'reactions'
        ]);

        Object.keys(Subject.hasMany).forEach(key => {
          const value = Reflect.get(Subject.hasMany, key);

          expect(value).to.be.an('object');
          expect(value).to.have.property('type').and.equal('hasMany');
          expect(Reflect.ownKeys(value)).to.include.all.members([
            'type',
            'model',
            'inverse',
            'through',
            'foreignKey'
          ]);
        });
      });

      it('adds a `belongsTo` property to the `Model`', () => {
        expect(Subject.belongsTo).to.have.all.keys(['user']);

        Object.keys(Subject.belongsTo).forEach(key => {
          const value = Reflect.get(Subject.belongsTo, key);

          expect(value).to.be.an('object');
          expect(value).to.have.property('type').and.equal('belongsTo');
          expect(Reflect.ownKeys(value)).to.include.all.members([
            'type',
            'model',
            'inverse',
            'foreignKey'
          ]);
        });
      });

      it('adds a `relationships` property to the `Model`', () => {
        expect(Subject.relationships).to.have.all.keys([
          'user',
          'tags',
          'comments',
          'reactions'
        ]);

        Object.keys(Subject.relationships).forEach(key => {
          const value = Reflect.get(Subject.relationships, key);

          expect(value).to.have.property('type');

          if (value.type === 'hasMany') {
            expect(Reflect.ownKeys(value)).to.include.all.members([
              'type',
              'model',
              'inverse',
              'through',
              'foreignKey'
            ]);
          } else {
            expect(Reflect.ownKeys(value)).to.include.all.members([
              'type',
              'model',
              'inverse',
              'foreignKey'
            ]);
          }
        });
      });

      it('adds a `relationshipNames` property to the `Model`', () => {
        expect(Subject.relationshipNames).to.include.all.members([
          'user',
          'tags',
          'comments',
          'reactions'
        ]);
      });

      it('adds relationship accessors to the `prototype`', () => {
        Object.keys(Subject.relationships).forEach(key => {
          const desc = Reflect.getOwnPropertyDescriptor(Subject.prototype, key);

          expect(desc).to.have.property('get').and.be.a('function');
          expect(desc).to.have.property('set').and.be.a('function');
        });
      });

      it('removes invalid hooks from the `hooks` property', () => {
        expect(Subject.hooks).to.have.all.keys([
          'afterCreate',
          'beforeDestroy'
        ]);

        expect(Subject.hooks.afterCreate).to.be.a('function');
        expect(Subject.hooks.beforeDestroy).to.be.a('function');
      });

      it('adds each scope to `Model`', () => {
        expect(Subject.scopes).to.have.all.keys([
          'isDraft',
          'isPublic'
        ]);

        Object.keys(Subject.scopes).forEach(key => {
          const value = Reflect.get(Subject, key);

          expect(value).to.be.a('function');
        });
      });

      it('removes invalid validations from the `validates` property', () => {
        expect(Subject.validates).to.have.all.keys(['title']);
        expect(Subject.validates.title).to.be.a('function');
      });

      it('adds a `modelName` property to the `Model`', () => {
        expect(Subject).to.have.property('modelName', 'subject');
      });

      it('adds a `modelName` property to the `prototype`', () => {
        expect(Subject).to.have.deep.property('prototype.modelName', 'subject');
      });

      it('adds a `resourceName` property to the `Model`', () => {
        expect(Subject).to.have.property('resourceName', 'subjects');
      });

      it('adds a `resourceName` property to the `prototype`', () => {
        expect(Subject)
          .to.have.deep.property('prototype.resourceName', 'subjects');
      });

      it('adds an `initialized` property to the `Model`', () => {
        expect(Subject.initialized).to.be.true;
      });

      describe('- without `tableName`', () => {
        class Post extends Model {}

        before(async () => {
          await Post.initialize(store, () => {
            return store.connection(Post.tableName);
          });
        });

        it('adds a `tableName` property to the `prototype`', () => {
          expect(Post).to.have.property('tableName', 'posts');
        });

        it('adds a `tableName` property to the `prototype`', () => {
          expect(Post).to.have.deep.property('prototype.tableName', 'posts');
        });
      });
    });

    describe('.create()', () => {
      let result: Subject;

      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      after(async () => {
        await result.destroy();
      });

      it('constructs and persists a `Model` instance', async () => {
        const body = 'Contents of "Test Post"...';
        const title = 'Test Post';

        result = await Subject.create({
          body,
          title,
          isPublic: true
        });

        expect(result).to.be.an.instanceof(Subject);

        expect(result).to.have.property('id').and.be.a('number');
        expect(result).to.have.property('body', body);
        expect(result).to.have.property('title', title);
        expect(result).to.have.property('isPublic', true);
        expect(result).to.have.property('createdAt').and.be.an.instanceof(Date);
        expect(result).to.have.property('updatedAt').and.be.an.instanceof(Date);
      });
    });

    describe('.all()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.all();

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.find()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.find();

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.page()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.page(1);

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.limit()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.limit(25);

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.offset()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.offset(0);

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.count()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.count();

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.order()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.order('createdAt', 'ASC');

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.where()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.where({
          isPublic: true
        });

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.not()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.not({
          isPublic: true
        });

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.first()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.first();

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.last()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.last();

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.select()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.select('title', 'createdAt');

        expect(result).to.be.an.instanceof(Query);
      });
    });

    describe('.distinct()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.distinct('title');

        expect(result).to.be.an.instanceof(Query);
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

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.include('user', 'comments');

        expect(result).to.be.an.instanceof(Query);
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

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns an instance of `Query`', () => {
        const result = Subject.unscope('isPublic');

        expect(result).to.be.an.instanceof(Query);
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

        expect(result).to.be.true;
      });

      it('returns false if a `Model` does not have a scope', () => {
        const result = Subject.hasScope('mostPopular');

        expect(result).to.be.false;
      });
    });

    describe('.isInstance()', () => {
      class SubjectA extends Model {
        static tableName = 'posts';
      }

      class SubjectB extends Model {
        static tableName = 'posts';
      }

      before(async () => {
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

        expect(result).to.be.true;
      });

      it('returns false if an object is an instance of the `Model`', () => {
        const instance = new SubjectA();
        const result = SubjectB.isInstance(instance);

        expect(result).to.be.false;
      });
    });

    describe('.columnFor()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns the column data for an attribute if it exists', () => {
        const result = Subject.columnFor('isPublic');

        expect(result).to.be.an('object').and.have.all.keys([
          'type',
          'docName',
          'nullable',
          'maxLength',
          'columnName',
          'defaultValue'
        ]);
      });
    });

    describe('.columnNameFor()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns the column name for an attribute if it exists', () => {
        const result = Subject.columnNameFor('isPublic');

        expect(result).to.equal('is_public');
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

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });
      });

      it('returns the data for a relationship if it exists', () => {
        const result = Subject.relationshipFor('user');

        expect(Reflect.ownKeys(result)).to.include.all.members([
          'type',
          'model',
          'inverse',
          'foreignKey'
        ]);
      });
    });

    describe('.hooks', () => {
      const assertCreateHook = (instance, hookSpy) => {
        expect(hookSpy.calledWith(instance)).to.be.true;
      };

      const assertSaveHook = async (instance, hookSpy) => {
        hookSpy.reset();

        instance.isPublic = true;
        await instance.save();

        expect(hookSpy.calledWith(instance)).to.be.true;
      };

      const assertUpdateHook = async (instance, hookSpy) => {
        hookSpy.reset();

        await instance.update({
          isPublic: true
        });

        expect(hookSpy.calledWith(instance)).to.be.true;
      };

      const assertDestroyHook = async (instance, hookSpy) => {
        await instance.destroy();
        expect(hookSpy.calledWith(instance)).to.be.true;
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

        before(async () => {
          hookSpy = spy(Subject.hooks, 'afterCreate');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });

          instance = await Subject.create({
            title: 'Test Hook (afterCreate)',
            isPublic: false
          });
        });

        after(async () => {
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

        before(async () => {
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

        before(async () => {
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

        before(async () => {
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

        before(async () => {
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

        before(async () => {
          hookSpy = spy(Subject.hooks, 'beforeCreate');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });

          instance = await Subject.create({
            title: 'Test Hook (beforeCreate)',
            isPublic: false
          });
        });

        after(async () => {
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
            async beforeDestroy() {}
          };
        }

        before(async () => {
          hookSpy = spy(Subject.hooks, 'beforeDestroy');

          await Subject.initialize(store, () => {
            return store.connection(Subject.tableName);
          });

          instance = await Subject.create({
            title: 'Test Hook (beforeDestroy)',
            isPublic: false
          });
        });

        after(async () => {
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

        before(async () => {
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
            async beforeUpdate() {}
          };
        }

        before(async () => {
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

        before(async () => {
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

      before(async () => {
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
        await Promise.all([
          instance.destroy(),
          ...Array.from(instances).map(record => {
            return record.destroy().then(() => {
              instances.delete(record);
            });
          })
        ]);
      });

      it('can persist dirty attributes', async () => {
        instance.isPublic = true;
        await instance.save();

        expect(instance).to.have.property('isPublic', true);

        const result = await Subject.find(instance.id);

        expect(result).to.have.property('isPublic', true);
      });

      it('can persist dirty relationships', async () => {
        const userInstance = await User.create({
          name: 'Test User',
          email: 'test-user@postlight.com',
          password: 'test12345678'
        });

        instances.add(userInstance);

        instance.user = userInstance;
        await instance.save(true);

        const {
          rawColumnData: {
            user,
            userId
          }
        } = await Subject
          .find(instance.id)
          .include('user');

        expect(user).to.be.an('object');
        expect(user).to.have.property('id', userId);
        expect(user).to.have.property('name', 'Test User');
        expect(user).to.have.property('email', 'test-user@postlight.com');
      });

      it('fails if a validation is not met', async () => {
        instance.title = 'Test';
        await instance.save().catch(err => {
          expect(err).to.be.an.instanceof(ValidationError);
        });

        expect(instance).to.have.property('title', 'Test');

        const result = await Subject.find(instance.id);

        expect(result).to.have.property('title', 'Test Post');
      });
    });

    describe('#update()', () => {
      let instance: Subject;

      class Subject extends Model {
        id: number;
        title: string;
        isPublic: boolean;

        static tableName = 'posts';

        static validates = {
          title: str => str.split(' ').length > 1
        };
      }

      before(async () => {
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

      it('can set and persist attributes', async () => {
        const body = 'Lots of content...';

        await instance.update({
          body,
          isPublic: true
        });

        expect(instance).to.have.property('body', body);
        expect(instance).to.have.property('isPublic', true);

        const result = await Subject.find(instance.id);

        expect(result).to.have.property('body', body);
        expect(result).to.have.property('isPublic', true);
      });

      it('fails if a validation is not met', async () => {
        await instance
          .update({
            title: 'Test',
            isPublic: true
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(ValidationError);
          });

        expect(instance).to.have.property('title', 'Test');
        expect(instance).to.have.property('isPublic', true);

        const result = await Subject.find(instance.id);
        expect(result).to.have.property('title', 'Test Post');
      });
    });

    describe('#destroy()', () => {
      let instance: Subject;

      class Subject extends Model {
        id: number;

        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          title: 'Test Post'
        });
      });

      after(async () => {
        await instance.destroy();
      });

      it('removes the record from the database', async () => {
        await instance.destroy();
        await Subject.find(instance.id).catch(err => {
          expect(err).to.be.an.instanceof(RecordNotFoundError);
        });
      });
    });

    describe('#getAttributes()', () => {
      let instance: Subject;

      class Subject extends Model {
        static tableName = 'posts';
      }

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          body: 'Lots of content...',
          title: 'Test Post',
          isPublic: true
        });
      });

      after(async () => {
        await instance.destroy();
      });

      it('returns a pojo containing the requested attributes', () => {
        const result = instance.getAttributes('body', 'title');

        expect(result).to.deep.equal({
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

      before(async () => {
        await Subject.initialize(store, () => {
          return store.connection(Subject.tableName);
        });

        instance = await Subject.create({
          title: 'Test Post'
        });
      });

      after(async () => {
        await instance.destroy();
      });

      it('returns the value of `instance[Model.primaryKey]`', () => {
        const result = instance.getPrimaryKey();

        expect(result).to.be.a('number');
      });
    });
  });
});
