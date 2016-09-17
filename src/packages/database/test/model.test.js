// @flow
import { expect } from 'chai';
import { it, before, after, describe } from 'mocha';

import Model from '../model';
import Query from '../query';

import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/model"', () => {
  describe('class Model', () => {
    let store;

    before(async () => {
      const app = await getTestApp();

      store = app.store;
    });

    describe('static .initialize()', () => {
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

      it('adds an `modelName` property to the `Model`', () => {
        expect(Subject.modelName).to.equal('subject');
      });

      it('adds an `modelName` property to the `prototype`', () => {
        expect(Subject.prototype.modelName).to.equal('subject');
      });

      it('adds an `resourceName` property to the `Model`', () => {
        expect(Subject.resourceName).to.equal('subjects');
      });

      it('adds an `resourceName` property to the `prototype`', () => {
        expect(Subject.prototype.resourceName).to.equal('subjects');
      });

      it('adds an `initialized` property to the `Model`', () => {
        expect(Subject.initialized).to.be.true;
      });
    });

    describe('static .create()', () => {
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

    describe('static .all()', () => {
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

    describe('static .find()', () => {
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

    describe('static .page()', () => {
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

    describe('static .limit()', () => {
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

    describe('static .offset()', () => {
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

    describe('static .count()', () => {
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

    describe('static .order()', () => {
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

    describe('static .where()', () => {
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

    describe('static .not()', () => {
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

    describe('static .first()', () => {
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

    describe('static .last()', () => {
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

    describe('static .select()', () => {
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

    describe('static .distinct()', () => {
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

    describe('static .include()', () => {
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

    describe('static .unscope()', () => {
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

    describe('static .hasScope()', () => {
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

    describe('static .isInstance()', () => {
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

    describe('static .columnFor()', () => {
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

    describe('static .columnNameFor()', () => {
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

    describe('static .relationshipFor()', () => {
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
  });
});
