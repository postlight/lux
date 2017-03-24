/* @flow */

import { dasherize } from 'inflection';

import { VERSION } from '../jsonapi';
import { freezeProps } from '../freezeable';
import uniq from '../../utils/uniq';
import underscore from '../../utils/underscore';
import promiseHash from '../../utils/promise-hash';
import { dasherizeKeys } from '../../utils/transform-keys';
// eslint-disable-next-line no-unused-vars
import type { Model } from '../database';
// eslint-disable-next-line no-duplicate-imports
import type { Document, Resource, Relationship } from '../jsonapi';
import type { ObjectMap } from '../../interfaces';

type Options<T> = {
  model?: Class<T>,
  parent?: ?Serializer<*>,
  namespace?: string,
};

/**
 * ## Overview
 *
 * The Serializer class is used to describe which attributes and relationships
 * to include for a particular resource.
 *
 * The attributes and relationships you declare in a Serializer will determine
 * the attributes and relationships that will be included in the response from
 * the resource that the Serializer represents.
 *
 * #### Attributes
 *
 * You can add attributes to your serializer using an array assigned to the
 * class property `attributes` like the example below.
 *
 * ```javascript
 * class UsersSerializer extends Serializer {
 *   attributes = [
 *     'name',
 *     'email',
 *     'username',
 *     'createdAt',
 *     'updatedAt'
 *   ];
 * }
 * ```
 *
 * Since the attributes required for a resource are declared ahead of time in a
 * Serializer, Lux will optimize SQL queries for the resource to only include
 * what the Serializer needs to build the response.
 *
 * ```javascript
 * import { Serializer } from 'lux-framework';
 *
 * class PostsSerializer extends Serializer {
 *   attributes = [
 *     'body',
 *     'title',
 *     'createdAt'
 *   ];
 * }
 *
 * export default PostsSerializer;
 * ```
 *
 * The Serializer above would result in resources returned from the `/posts`
 * endpoint to only include the `body`, `title`, and `createdAt` attributes. If
 * we wanted include an additional attribute such as `isPublic`, we would have
 * to add `'isPublic'` to the `attributes` property.
 *
 * ```javascript
 * import { Serializer } from 'lux-framework';
 *
 * class PostsSerializer extends Serializer {
 *   attributes = [
 *     'body',
 *     'title',
 *     'isPublic',
 *     'createdAt'
 *   ];
 * }
 *
 * export default PostsSerializer;
 * ```
 *
 * #### Associations
 *
 * Similar to `attributes` you can declare associations by adding relationship
 * names to either the `hasOne` or `hasMany` property arrays on a Serializer.
 *
 * Serializers are not concerned with ownership when it comes to associations,
 * so both `hasOne` and `belongsTo` associations can be specified in the
 * `hasOne` array property.
 *
 * ```javascript
 * import { Model } from 'lux-framework';
 *
 * class Post extends Model {
 *  static hasOne = {
 *    image: {
 *      inverse: 'post'
 *    }
 *  };
 *
 *  static hasMany = {
 *    tags: {
 *      inverse: 'posts',
 *      through: 'categorization'
 *    },
 *
 *    comments: {
 *      inverse: 'post'
 *    }
 *  };
 *
 *  static belongsTo = {
 *    user: {
 *      inverse: 'posts'
 *    }
 *  };
 * }
 *
 * export default Post;
 * ```
 *
 * To include the `user` and `image` associations in the response returned from
 * the `/posts` endpoint, we must specify both associations in the `hasOne`
 * property array of the Serializer.
 *
 * ```javascript
 * import { Serializer } from 'lux-framework';
 *
 * class PostsSerializer extends Serializer {
 *  hasOne = [
 *    'user',
 *    'image'
 *  ];
 * }
 *
 * export default PostsSerializer;
 * ```
 *
 * If we wanted to also include the `tags` and `comments` in the response, we
 * have to add a `hasMany` array property containing `'tags'` and `'comments'`.
 *
 * ```javascript
 * import { Serializer } from 'lux-framework';
 *
 * class PostsSerializer extends Serializer {
 *  hasOne = [
 *    'user',
 *    'image'
 *  ];
 *
 *  hasMany = [
 *    'tags',
 *    'comments'
 *  ];
 * }
 *
 * export default PostsSerializer;
 * ```
 *
 * You no longer need to specify that `tags` is a many to many relationship
 * using the `Categorization` model as a join table.
 *
 * #### Including Related Resources
 *
 * When requesting related resources for an endpoint, the included resource will
 * follow the serialization rules defined by the included resources Serializer.
 *
 * If we request that the `posts` association is included from the `/users`
 * endpoint, we will only get the `attributes` that the `PostsSerializer` has
 * defined even though the response is processed by the `UsersSerializer`.
 *
 * #### Sparse Fieldsets
 *
 * When a request specifies the fields that it would like included in the
 * response, the fields **MUST** be declared in the `attributes` property array
 * of the resources Serializer, or they will be ignored.
 *
 * #### Namespaces
 *
 * When using namespaces, you are not required to have a Serializer for each
 * resource as long as a Serializer for the given resource can be resolved
 * upstream.
 *
 * For example, if you have a `posts` resource and you decide to implement an
 * admin namespace, you only need to export an `AdminPostsSerializer` from
 * `app/serializers/admin/posts.js` if you want to specify different attributes
 * or relationships than the `PostsSerializer` exported from
 * `app/serializers/posts.js`.
 *
 * In the event that you do want to specify different attributes or
 * relationships that the `PostsSerializer` exported from
 * `app/serializers/posts.js`, you are not required to extend `PostsSerializer`.
 *
 * ```javascript
 * import { Serializer } from 'lux-framework';
 *
 * class PostsSerializer extends Serializer {
 *   attributes = [
 *     'body',
 *     'title',
 *     'createdAt'
 *   ];
 *
 *   hasOne = [
 *     'user',
 *     'image'
 *   ];
 *
 *   hasMany = [
 *     'tags',
 *     'comments'
 *   ];
 * }
 *
 * export default PostsSerializer;
 * ```
 *
 * To add the `isPublic` attribute to the response payload of requests to a
 * `/admin/posts` endpoint we can do either of the following examples:
 *
 * ```javascript
 * // app/serializers/admin/posts.js
 * import PostsSerializer from 'app/serializers/posts';
 *
 * class AdminPostsSerializer extends PostsSerializer {
 *   attributes = [
 *     'body',
 *     'title',
 *     'isPublic',
 *     'createdAt'
 *   ];
 * }
 *
 * export default AdminPostsSerializer;
 * ```
 *
 * OR
 *
 * ```javascript
 * // app/serializers/admin/posts.js
 * import { Serializer } from 'lux-framework';
 *
 * class AdminPostsSerializer extends Serializer {
 *   attributes = [
 *     'body',
 *     'title',
 *     'isPublic',
 *     'createdAt'
 *   ];
 *
 *   hasOne = [
 *     'user',
 *     'image'
 *   ];
 *
 *   hasMany = [
 *     'tags',
 *     'comments'
 *   ];
 * }
 *
 * export default AdminPostsSerializer;
 * ```
 *
 * Even with inheritance, the examples above are a tad repetitive. We can
 * improve this code by exporting constants from `app/serializers/posts.js`.
 *
 * ```javascript
 * import { Serializer } from 'lux-framework';
 *
 * export const HAS_ONE = [
 *   'user',
 *   'image'
 * ];
 *
 * export const HAS_MANY = [
 *   'tags',
 *   'comments'
 * ];
 *
 * export const ATTRIBUTES = [
 *   'body',
 *   'title',
 *   'createdAt'
 * ];
 *
 * class PostsSerializer extends Serializer {
 *   hasOne = HAS_ONE;
 *   hasMany = HAS_MANY;
 *   attributes = ATTRIBUTES;
 * }
 *
 * export default PostsSerializer;
 * ```
 *
 * If we choose to use inheritance, our code can look like this:
 *
 * ```javascript
 * // app/serializers/admin/posts.js
 * import PostsSerializer, { ATTRIBUTES } from 'app/serializers/posts';
 *
 * class AdminPostsSerializer extends PostsSerializer {
 *   attributes = [
 *     ...ATTRIBUTES,
 *     'isPublic'
 *   ];
 * }
 *
 * export default AdminPostsSerializer;
 * ```
 *
 * If we choose not use inheritance, our code can look like this:
 *
 * ```javascript
 * // app/serializers/admin/posts.js
 * import { Serializer } from 'lux-framework';
 * import { HAS_ONE, HAS_MANY, ATTRIBUTES } from 'app/serializers/posts';
 *
 * class AdminPostsSerializer extends PostsSerializer {
 *   hasOne = HAS_ONE;
 *   hasMany = HAS_MANY;
 *
 *   attributes = [
 *     ...ATTRIBUTES,
 *     'isPublic'
 *   ];
 * }
 *
 * export default AdminPostsSerializer;
 * ```
 *
 * @class Serializer
 * @public
 */
class Serializer<T: Model> {
  /**
   * An Array of the `hasOne` or `belongsTo` relationships on a Serializer
   * instance's Model to include in the
   * `relationships` resource object of a serialized payload.
   *
   * ```javascript
   * class PostsSerializer extends Serializer {
   *   hasOne = [
   *     'user'
   *   ];
   * }
   * ```
   *
   * @property hasOne
   * @type {Array}
   * @default []
   * @public
   */
  hasOne: Array<string> = [];

  /**
   * An Array of the `hasMany` relationships on a Serializer instance's Model to
   * include in the `relationships` resource object of a serialized payload.
   *
   * ```javscript
   * class PostsSerializer extends Serializer {
   *   hasMany = [
   *     'comments'
   *   ];
   * }
   * ```
   *
   * @property hasMany
   * @type {Array}
   * @default []
   * @public
   */
  hasMany: Array<string> = [];

  /**
   * An array of the `attributes` on a Serializer instance's Model to include in
   * the `attributes` resource object of a serialized payload.
   *
   * ```javscript
   * class PostsSerializer extends Serializer {
   *   attributes = [
   *     'body',
   *     'title'
   *   ];
   * }
   * ```
   *
   * @property attributes
   * @type {Array}
   * @default []
   * @public
   */
  attributes: Array<string> = [];

  /**
   * The resolved Model that a Serializer instance represents.
   *
   * @property model
   * @type {Model}
   * @private
   */
  model: Class<T>;

  /**
   * A reference to the root Serializer for the namespace that a Serializer
   * instance is a member of.
   *
   * @property parent
   * @type {?Serializer}
   * @private
   */
  parent: ?Serializer<*>;

  /**
   * The namespace that a Serializer instance is a member of.
   *
   * @property namespace
   * @type {String}
   * @private
   */
  namespace: string;

  constructor(options: Options<T> = {}) {
    const { model, parent } = options;
    let { namespace } = options;

    if (typeof namespace !== 'string') {
      namespace = '';
    }

    Object.assign(this, {
      model,
      parent,
      namespace,
    });

    freezeProps(this, true,
      'model',
      'parent',
      'namespace'
    );
  }

  /**
   * Transform an array of Model instances or a single Model instance into a
   * [JSON API](http://jsonapi.org) document object.
   *
   * @method format
   *
   * @param {Object} options - An options object used for building the
   * returned [JSON API](http://jsonapi.org) document object.
   *
   * @param {Model|Array} options.data - The Model instance or array of
   * Model instances to transform into the returned [JSON API](
   * http://jsonapi.org) document object.
   *
   * @param {Object} options.links - An object containing links to include in
   * the top level links object of the returned [JSON API](http://jsonapi.org)
   * document object.
   *
   * @param {String} options.domain - A string used to build links included in
   * the resource and relationship objects in the returned [JSON API](
   * http://jsonapi.org) document object.
   *
   * @param {Array} options.include - An array of strings containing the
   * relationship keys that should be added to the top level included object of
   * the returned [JSON API](http://jsonapi.org) document object.
   *
   * @return {Promise} Resolves with a [JSON API](http://jsonapi.org) document
   * object.
   *
   * @private
   */
  async format({
    data,
    links,
    domain,
    include
  }: {
    data: T | Array<T>;
    links: $PropertyType<Document, 'links'>;
    domain: string;
    include: Array<string>;
  }): Promise<Document> {
    let serialized = {};
    const included: Array<Resource> = [];

    if (Array.isArray(data)) {
      serialized = {
        data: await Promise.all(
          data.map(item => this.formatOne({
            item,
            domain,
            include,
            included
          }))
        )
      };
    } else {
      serialized = {
        data: await this.formatOne({
          domain,
          include,
          included,
          item: data,
          links: false
        })
      };
    }

    if (included.length) {
      serialized = {
        ...serialized,
        included: uniq(included, 'id', 'type')
      };
    }

    return {
      ...serialized,
      links,

      jsonapi: {
        version: VERSION
      }
    };
  }

  /**
   * Transform a single Model instance into a [JSON API](http://jsonapi.org)
   * resource object.
   *
   * @method formatOne
   *
   * @param {Object} options - An options object used for building the returned
   * [JSON API](http://jsonapi.org) resource object.
   *
   * @param {Model} options.item - The Model instance to transform into the
   * returned [JSON API](http://jsonapi.org) resource object.
   *
   * @param {Object} options.links - An object containing links to include in
   * the top level links object of the returned [JSON API](http://jsonapi.org)
   * resource object.
   *
   * @param {String} options.domain - A string used to build links included in
   * the top level links object or relationship links objects in the returned
   * [JSON API](http://jsonapi.org) resource object.
   *
   * @param {Array} options.include - An array of strings containing the
   * relationship keys that should be added to the top level included object of
   * a [JSON API](http://jsonapi.org) document object.
   *
   * @param {Array} options.included - An array of [JSON API](
   * http://jsonapi.org) resource objects that will be added to the top level
   * included array of a [JSON API](http://jsonapi.org) document object.
   *
   * @param {Boolean} options.formatRelationships - Wether or not
   * relationships should be formatted and included in the returned
   * [JSON API](http://jsonapi.org) resource object.
   *
   * @return {Promise} Resolves with a [JSON API](http://jsonapi.org) resource
   * object.
   *
   * @private
   */
  async formatOne({
    item,
    links,
    domain,
    include,
    included,
    formatRelationships = true
  }: {
    item: T;
    links?: boolean;
    domain: string;
    include: Array<string>;
    included: Array<Resource>;
    formatRelationships?: boolean
  }): Promise<Resource> {
    const { resourceName: type } = item;
    const id = String(item.getPrimaryKey());
    let relationships: ObjectMap<Relationship> = {};

    const attributes = dasherizeKeys(
      item.getAttributes(
        ...Object
          .keys(item.rawColumnData)
          .filter(key => this.attributes.includes(key))
      )
    );

    const serialized: Resource = {
      id,
      type,
      attributes,
    };

    if (formatRelationships) {
      relationships = await promiseHash(
        [...this.hasOne, ...this.hasMany].reduce((hash, name) => ({
          ...hash,

          [dasherize(underscore(name))]: (async () => {
            const related = await Reflect.get(item, name);

            if (Array.isArray(related)) {
              return {
                data: await Promise.all(
                  related.map(async (relatedItem) => {
                    const {
                      data: relatedData
                    } = await this.formatRelationship({
                      domain,
                      included,
                      item: relatedItem,
                      include: include.includes(name)
                    });

                    return relatedData;
                  })
                )
              };
            } else if (related && related.id) {
              return this.formatRelationship({
                domain,
                included,
                item: related,
                include: include.includes(name)
              });
            }

            return {
              data: null
            };
          })()
        }), {})
      );
    }

    if (Object.keys(relationships).length) {
      serialized.relationships = relationships;
    }

    if (links || typeof links !== 'boolean') {
      const { namespace } = this;

      if (namespace) {
        serialized.links = {
          self: `${domain}/${namespace}/${type}/${id}`
        };
      } else {
        serialized.links = {
          self: `${domain}/${type}/${id}`
        };
      }
    }

    return serialized;
  }

  /**
   * Transform a single Model instance into a [JSON API](http://jsonapi.org)
   * relationship object.
   *
   * @method formatRelationship
   *
   * @param {Object} options - An options object used for building the returned
   * [JSON API](http://jsonapi.org) relationship object.
   *
   * @param {Model} options.item - The Model instance to transform into the
   * returned [JSON API](http://jsonapi.org) relationship object.
   *
   * @param {String} options.domain - A string used to build links included in
   * the returned [JSON API](http://jsonapi.org) relationship object.
   *
   * @param {Array} options.include - An array of strings containing the
   * relationship keys that should be added to the top level included object of
   * a [JSON API](http://jsonapi.org) document object.
   *
   * @param {Array} options.included - An array of [JSON API](
   * http://jsonapi.org) resource objects that will be added to the top level
   * included array of a [JSON API](http://jsonapi.org) document object.
   *
   * @return {Promise} Resolves with a [JSON API](http://jsonapi.org)
   * relationship object.
   *
   * @private
   */
  async formatRelationship({
    item,
    domain,
    include,
    included
  }: {
    item: Model;
    domain: string;
    include: boolean;
    included: Array<Resource>;
  }): Promise<Relationship> {
    const { namespace } = this;
    const { resourceName: type, constructor: { serializer } } = item;
    const id = String(item.getPrimaryKey());
    let links;

    if (namespace) {
      links = {
        self: `${domain}/${namespace}/${type}/${id}`
      };
    } else {
      links = {
        self: `${domain}/${type}/${id}`
      };
    }

    if (include) {
      included.push(
        await serializer.formatOne({
          item,
          domain,
          include: [],
          included: [],
          formatRelationships: false
        })
      );
    }

    return {
      data: {
        id,
        type
      },
      links
    };
  }
}

export default Serializer;
