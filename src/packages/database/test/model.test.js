// @flow
import Model from '../model';
import Query, { RecordNotFoundError } from '../query';
import { ValidationError } from '../validation';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/model"', () => {
  describe('class Model', () => {
    let store;
    let User: Class<Model>;
    let Image: Class<Model>;
    let Comment: Class<Model>;

    beforeAll(async () => {
      ({ store } = await getTestApp());

      User = store.modelFor('user');
      Image = store.modelFor('image');
      Comment = store.modelFor('comment');
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

        static hooks = [
          'afterCreate',
          'beforeDestroy',
          'duringDestroy',
        ].reduce((hooks, key) => {
          // eslint-disable-next-line no-param-reassign
          hooks[key] = jest.fn().mockImplementation(() => Promise.resolve());
          return hooks;
        }, {});

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
          notAnAttribute: () => false,
        };
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        const metaFor = (columnName, docName = columnName) => (
          expect.objectContaining({
            columnName,
            docName,
            type: expect.any(String),
            nullable: expect.any(Boolean),
          })
        );

        expect(Subject.attributes).toEqual({
          id: metaFor('id'),
          body: metaFor('body'),
          isPublic: metaFor('is_public', 'is-public'),
          title: metaFor('title'),
          userId: metaFor('user_id', 'user-id'),
          createdAt: metaFor('created_at', 'created-at'),
          updatedAt: metaFor('updated_at', 'updated-at'),
        });
      });

      it('adds an `attributeNames` property to the `Model`', () => {
        expect(Subject.attributeNames).toMatchSnapshot();
      });

      it('adds attribute accessors on the `prototype`', () => {
        Object
          .keys(Subject.attributes)
          .forEach(key => {
            const desc = Reflect.getOwnPropertyDescriptor(
              Subject.prototype,
              key
            );

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
        Subject.relationshipNames.forEach(key => {
          const desc = Reflect.getOwnPropertyDescriptor(Subject.prototype, key);

          expect(desc).toEqual(
            expect.objectContaining({
              get: expect.any(Function),
              set: expect.any(Function),
            })
          );
        });
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
        expect(Subject.prototype.modelName).toBe('subject');
      });

      it('adds a `resourceName` property to the `Model`', () => {
        expect(Subject.resourceName).toBe('subjects');
      });

      it('adds a `resourceName` property to the `prototype`', () => {
        expect(Subject.prototype.resourceName).toBe('subjects');
      });

      it('adds an `initialized` property to the `Model`', () => {
        expect(Subject.initialized).toBe(true);
      });

      describe('- without `tableName`', () => {
        class Post extends Model {}

        beforeAll(async () => {
          await Post.initialize(store, () => store.connection(Post.tableName));
        });

        it('adds a `tableName` property to the `prototype`', () => {
          expect(Post.tableName).toBe('posts');
        });

        it('adds a `tableName` property to the `prototype`', () => {
          expect(Post.prototype.tableName).toBe('posts');
        });
      });
    });

    describe('.create()', () => {
      let result;

      class Subject extends Model {
        id: number;
        body: ?string;
        title: ?string;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;

        static tableName = 'posts';

        static belongsTo = {
          user: {
            inverse: 'posts'
          }
        };
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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

        // $FlowIgnore
        result = result.unwrap();

        expect(result instanceof Subject).toBe(true);

        expect(result.id).toEqual(expect.any(Number));
        expect(result.body).toBe(body);
        expect(result.title).toBe(title);
        expect(result.isPublic).toBe(true);
        expect(result.createdAt).toEqual(expect.any(Date));
        expect(result.updatedAt).toEqual(expect.any(Date));

        const userResult = await result.user;

        expect(userResult.id).toEqual(user.getPrimaryKey());
      });
    });

    describe('.transacting()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
          SubjectA.initialize(
            store,
            () => store.connection(SubjectA.tableName)
          ),
          SubjectB.initialize(
            store,
            () => store.connection(SubjectB.tableName)
          ),
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
      });

      it('returns the column data for an attribute if it exists', () => {
        expect(Subject.columnFor('isPublic')).toEqual(
          expect.objectContaining({
            columnName: 'is_public',
            docName: 'is-public',
            type: expect.any(String),
            nullable: expect.any(Boolean),
          })
        );
      });
    });

    describe('.columnNameFor()', () => {
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
      });

      it('returns the data for a relationship if it exists', () => {
        expect(Subject.relationshipFor('user')).toMatchSnapshot();
      });
    });

    describe('.hooks', () => {
      ['after', 'before'].forEach(prefix => {
        ['Save', 'Create', 'Destroy', 'Validation'].forEach(suffix => {
          const trx = expect.any(Function);
          const name = prefix + suffix;
          const tableName = 'posts';
          let Subject;
          let instance;
          let hook;

          describe(`.${name}()`, () => {
            beforeAll(async () => {
              hook = jest.fn().mockReturnValue(Promise.resolve());

              Subject = class extends Model {
                isPublic: boolean;
                static hooks = { [name]: hook };
                static tableName = tableName;
              };

              await Subject.initialize(
                store,
                () => store.connection(tableName)
              );
            });

            beforeEach(async () => {
              instance = await Subject
                .create({
                  title: 'Test Hook',
                  isPublic: false,
                })
                .then(result => (
                  result.unwrap()
                ));
            });

            afterEach(async () => {
              if (hook) {
                hook.mockClear();
              }

              if (suffix !== 'Destroy') {
                await instance.destroy();
              }
            });

            if (/^(save|create|validation)$/i.test(suffix)) {
              it('runs when .create() is called', () => {
                expect(hook).toBeCalledWith(instance, trx);
              });
            }

            if (/^(save|update|validation)$/i.test(suffix)) {
              it('runs when #save() is called', async () => {
                instance.isPublic = true;
                await instance.save();

                expect(hook).toBeCalledWith(instance, trx);
              });

              it('runs when #update() is called', async () => {
                await instance.update({
                  isPublic: true,
                });

                expect(hook).toBeCalledWith(instance, trx);
              });
            }

            if (suffix === 'Destroy') {
              it('runs when #destroy() is called', async () => {
                await instance.destroy();

                expect(hook).toBeCalledWith(instance, trx);
              });
            }
          });
        });
      });
    });

    describe('.attributes', () => {
      class Subject extends Model {
        body: void | ?string;
        title: ?string;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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

    ['save', 'update'].forEach(method => {
      describe(`#${method}()`, () => {
        let user;
        let image;
        let comment;
        let instance;

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
          await Subject.initialize(
            store,
            () => store.connection(Subject.tableName)
          );
        });

        beforeEach(async () => {
          instance = await Subject.create({
            title: 'Test Post',
            isPublic: false
          });
        });

        afterEach(async () => {
          await instance.destroy();

          if (user) {
            await user.destroy();
          }

          if (image) {
            await image.destroy();
          }

          if (comment) {
            await comment.destroy();
          }
        });

        it('can set and persist attributes and relationships', async () => {
          const body = 'Lots of content...';

          [user, image, comment] = await User.transaction(trx => (
            Promise.all([
              User.transacting(trx).create({
                name: 'Test User',
                email: '',
                password: 'password',
              }),
              Image.transacting(trx).create({
                url: 'https://postlight.com',
              }),
              Comment.transacting(trx).create({
                message: 'Test',
              }),
            ])
          ));

          if (method === 'update') {
            await instance.update({
              body,
              user,
              image,
              comments: [
                comment,
              ],
              isPublic: true
            });
          } else {
            // $FlowIgnore
            Object.assign(instance, {
              body,
              user,
              image,
              comments: [
                comment,
              ],
              isPublic: true
            });

            await instance.save();
          }

          expect(instance.body).toBe(body);
          expect(instance.isPublic).toBe(true);

          let result = await Subject
            .find(instance.getPrimaryKey())
            .include(
              'user',
              'image',
              'comments'
            );

          result = result.toObject();

          expect(result.body).toBe(body);
          expect(result.isPublic).toBe(true);

          expect(result.user).toEqual(
            expect.objectContaining({
              id: user.getPrimaryKey(),
            })
          );

          expect(result.image).toEqual(
            expect.objectContaining({
              id: image.getPrimaryKey(),
            })
          );

          expect(result.comments).toEqual(expect.any(Array));
        });

        it('fails if a validation is not met', async () => {
          await instance
            .update({
              title: 'Test',
              isPublic: true,
            })
            .catch(err => {
              expect(err).toBeInstanceOf(ValidationError);
            });

          expect(instance.title).toEqual('Test');
          expect(instance.isPublic).toEqual(true);

          const result = await Subject.find(instance.id);

          expect(result.title).toEqual('Test Post');
          expect(result.isPublic).toEqual(false);
        });
      });
    });

    describe('#destroy()', () => {
      let instance;

      class Subject extends Model {
        id: number;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );

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
      let instance;

      class Subject extends Model {
        title: string;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );

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
      let instance;

      class Subject extends Model {
        title: string;

        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );

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
      let instance;

      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );

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
      let instance;

      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );

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
      class Subject extends Model {
        static tableName = 'posts';
      }

      beforeAll(async () => {
        await Subject.initialize(
          store,
          () => store.connection(Subject.tableName)
        );
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
