// @flow
import { dasherize } from 'inflection';

import { VERSION } from '../jsonapi';
import { freezeProps } from '../freezeable';

import uniq from '../../utils/uniq';
import underscore from '../../utils/underscore';
import promiseHash from '../../utils/promise-hash';
import { dasherizeKeys } from '../../utils/transform-keys';

import type { Model } from '../database';
import type { Serializer$opts } from './interfaces';

import type {
  JSONAPI$Document,
  JSONAPI$DocumentLinks,
  JSONAPI$ResourceObject,
  JSONAPI$RelationshipObject
} from '../jsonapi';

/**
 * The `Serializer` class is where you declare the specific attributes and
 * relationships you would like to include for a particular resource (`Model`).
 */
class Serializer {
  /**
   * The resolved `Model` that a `Serializer` instance represents.
   *
   * @example
   * PostsSerializer.model
   * // => Post
   *
   * @property model
   * @memberof Serializer
   * @instance
   */
  model: Class<Model>;

  /**
   * A reference to the root `Serializer` for the namespace that a `Serializer`
   * instance is a member of.
   *
   * @property parent
   * @memberof Serializer
   * @instance
   */
  parent: ?Serializer;

  /**
   * The namespace that a `Serializer` instance is a member of.
   *
   * @property namespace
   * @memberof Serializer
   * @instance
   */
  namespace: string;

  /**
   * An Array of the `hasOne` or `belongsTo` relationships on a `Serializer`
   * instance's model to include in the `relationships` resource object of a
   * serialized payload.
   *
   * @example
   * class PostsSerializer extends Serializer {
   *   hasOne = [
   *     'author'
   *   ];
   * }
   *
   * // A request to `/posts` would result in the following payload:
   *
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "type": "posts",
   *       "attributes": {},
   *       "relationships": [
   *         {
   *           "data": {
   *             "id": 1,
   *             "type": "authors"
   *           },
   *            "links": {
   *              "self": "http://localhost:4000/authors/1"
   *           }
   *         }
   *       ],
   *       "links": {
   *         "self": "http://localhost:4000/posts/1"
   *       }
   *     }
   *   ],
   *   "links": {
   *     "self": "http://localhost:4000/posts",
   *     "first": "http://localhost:4000/posts",
   *     "last": "http://localhost:4000/posts",
   *     "prev": null,
   *     "next": null
   *   }
   *   "jsonapi": {
   *     "version": "1.0"
   *   }
   * }
   *
   * @property hasOne
   * @memberof Serializer
   * @instance
   */
  hasOne: Array<string> = [];

  /**
   * An Array of the `hasMany` relationships on a `Serializer` instance's model
   * to include in the `relationships` resource object of a serialized payload.
   *
   * @example
   * class PostsSerializer extends Serializer {
   *   hasMany = [
   *     'comments'
   *   ];
   * }
   *
   * // A request to `/posts` would result in the following payload:
   *
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "type": "posts",
   *       "attributes": {},
   *       "relationships": [
   *         {
   *           "data": {
   *             "id": 1,
   *             "type": "comments"
   *           },
   *            "links": {
   *              "self": "http://localhost:4000/comments/1"
   *           }
   *         },
   *         {
   *           "data": {
   *             "id": 2,
   *             "type": "comments"
   *           },
   *            "links": {
   *              "self": "http://localhost:4000/comments/2"
   *           }
   *         }
   *       ],
   *       "links": {
   *         "self": "http://localhost:4000/posts/1"
   *       }
   *     }
   *   ],
   *   "links": {
   *     "self": "http://localhost:4000/posts",
   *     "first": "http://localhost:4000/posts",
   *     "last": "http://localhost:4000/posts",
   *     "prev": null,
   *     "next": null
   *   }
   *   "jsonapi": {
   *     "version": "1.0"
   *   }
   * }
   *
   * @property hasMany
   * @memberof Serializer
   * @instance
   */
  hasMany: Array<string> = [];

  /**
   * An Array of the `attributes` on a `Serializer` instance's model to include
   * in the `attributes` resource object of a serialized payload.
   *
   * @example
   * class PostsSerializer extends Serializer {
   *   attributes = [
   *     'title',
   *     'isPublic'
   *   ];
   * }
   *
   * // A request to `/posts` would result in the following payload:
   *
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "type": "posts",
   *       "attributes": {
   *         "title": "Not another Node.js framework...",
   *         "is-public": true
   *       },
   *       "links": {
   *         "self": "http://localhost:4000/posts/1"
   *       }
   *     }
   *   ],
   *   "links": {
   *     "self": "http://localhost:4000/posts",
   *     "first": "http://localhost:4000/posts",
   *     "last": "http://localhost:4000/posts",
   *     "prev": null,
   *     "next": null
   *   }
   *   "jsonapi": {
   *     "version": "1.0"
   *   }
   * }
   *
   * @property attributes
   * @memberof Serializer
   * @instance
   */
  attributes: Array<string> = [];

  /**
   * Create an instance of `Serializer`.
   *
   * WARNING:
   * This is a private constructor and you should not instantiate a `Serializer`
   * manually. Serializers are instantiated automatically by your application
   * when it is started.
   *
   * @private
   */
  constructor({ model, parent, namespace }: Serializer$opts) {
    Object.assign(this, {
      model,
      parent,
      namespace
    });

    freezeProps(this, true,
      'model',
      'parent',
      'namespace'
    );
  }

  /**
   * @private
   */
  async format({
    data,
    links,
    domain,
    include
  }: {
    data: Model | Array<Model>;
    links: JSONAPI$DocumentLinks;
    domain: string;
    include: Array<string>;
  }): Promise<JSONAPI$Document> {
    let serialized = {};
    const included: Array<JSONAPI$ResourceObject> = [];

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
    item: Model;
    links?: boolean;
    domain: string;
    include: Array<string>;
    included: Array<JSONAPI$ResourceObject>;
    formatRelationships?: boolean
  }): Promise<JSONAPI$ResourceObject> {
    const { resourceName: type } = item;
    const id = item.getPrimaryKey().toString();
    let relationships = {};

    const attributes = dasherizeKeys(
      item.getAttributes(...Object.keys(item.rawColumnData).filter(key => {
        return this.attributes.includes(key);
      }))
    );

    const serialized: JSONAPI$ResourceObject = {
      id,
      type,
      attributes
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
              return await this.formatRelationship({
                domain,
                included,
                item: related,
                include: include.includes(name)
              });
            } else {
              return null;
            }
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
    included: Array<JSONAPI$ResourceObject>;
  }): Promise<JSONAPI$RelationshipObject> {
    const { namespace } = this;
    const { resourceName: type, constructor: { serializer } } = item;
    const id = item.getPrimaryKey().toString();
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
      data: { id, type },
      links
    };
  }
}

export default Serializer;
