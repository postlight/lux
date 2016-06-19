// @flow
import { pluralize } from 'inflection';

import { Model } from '../database';

import pick from '../../utils/pick';
import insert from '../../utils/insert';
import entries from '../../utils/entries';
import { dasherizeKeys } from '../../utils/transform-keys';

const idRegExp = /^id$/;

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
   * @readonly
   * @private
   */
  model: typeof Model;

  /**
   * A Map of all resolved serializers in a an `Application` instance. This is
   * used when a `Serializer` instance has to serialize an embedded
   * relationship.
   *
   * @property serializers
   * @memberof Serializer
   * @instance
   * @readonly
   * @private
   */
  serializers: Map<string, Serializer>;

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
   constructor({
     model,
     serializers
   }: {
     model: typeof Model,
     serializers: Map<string, Serializer>
   } = {}) {
     Object.defineProperties(this, {
       model: {
         value: model,
         writable: false,
         enumerable: false,
         configurable: false
       },

       serializers: {
         value: serializers,
         writable: false,
         enumerable: false,
         configurable: false
       }
     });

     return this;
   }

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
   get hasOne(): Array<string> {
     return Object.freeze([]);
   }

   set hasOne(value: Array<string>): void {
     if (value && value.length) {
       const hasOne = new Array(value.length);

       insert(hasOne, value);

       Object.defineProperty(this, 'hasOne', {
         value: Object.freeze(hasOne),
         writable: false,
         enumerable: true,
         configurable: false
       });
     }
   }

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
   get hasMany(): Array<string> {
     return Object.freeze([]);
   }

   set hasMany(value: Array<string>): void {
     if (value && value.length) {
       const hasMany = new Array(value.length);

       insert(hasMany, value);

       Object.defineProperty(this, 'hasMany', {
         value: Object.freeze(hasMany),
         writable: false,
         enumerable: true,
         configurable: false
       });
     }
   }

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
   get attributes(): Array<string> {
     return Object.freeze([]);
   }

   set attributes(value: Array<string>): void {
     if (value && value.length) {
       const attributes = new Array(value.length);

       insert(attributes, value);

       Object.defineProperty(this, 'attributes', {
         value: Object.freeze(attributes),
         writable: false,
         enumerable: true,
         configurable: false
       });
     }
   }

  /**
   * @private
   */
  format({
    data,
    links,
    fields,
    domain,
    include
  }: {
    data: ?(Object | Array<Object> | Model),
    links: Object,
    fields: Array<string>,
    domain: string,
    include: Object
  }): Object | Array<Object> {
    let serialized = {};

    if (data instanceof Model || Array.isArray(data)) {
      const included = [];

      if (Array.isArray(fields)) {
        fields = fields.filter(field => !idRegExp.test(field));
      } else {
        fields = [];
      }

      if (Array.isArray(data)) {
        serialized = {
          ...serialized,

          data: data.map(item => {
            return this.formatOne({
              item,
              fields,
              domain,
              include,
              included
            });
          })
        };
      } else {
        serialized = {
          ...serialized,

          data: this.formatOne({
            fields,
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
          included
        };
      }

      if (links) {
        serialized = {
          ...serialized,
          links
        };
      }
    } else if (data instanceof Object) {
      serialized = data;
    }

    return {
      ...serialized,

      jsonapi: {
        version: '1.0'
      }
    };
  }

  /**
   * @private
   */
  formatOne({
    item,
    links,
    fields,
    domain,
    include,
    included
  }: {
    item: Model,
    links?: boolean,
    fields: Array<string>,
    domain: string,
    include: Object,
    included: Array<Object>
  }): Object {
    const { id } = item;
    const attributes = dasherizeKeys(pick(item, ...fields));

    let { modelName: type } = item;
    type = pluralize(type);

    if (Array.isArray(attributes)) {
      return {};
    }

    let serialized: {
      id: number,
      type: string,
      links?: Object,
      attributes: Object,
      relationships?: Object
    } = {
      id,
      type,
      attributes
    };

    if (Object.keys(include).length) {
      const relationships = entries(include).reduce((hash, [name, attrs]) => {
        const related = item[name];

        attrs = attrs.filter(field => !idRegExp.test(field));

        if (related instanceof Model) {
          hash[name] = this.formatRelationship({
            domain,
            included,
            item: related,
            links: true,
            fields: attrs
          });
        } else if (Array.isArray(related) && related.length) {
          hash[name] = {
            data: related.map(relatedItem => {
              const {
                data: relatedData,
                links: relatedLinks
              } = this.formatRelationship({
                domain,
                included,
                item: relatedItem,
                links: true,
                fields: attrs
              });

              return {
                ...relatedData,
                links: relatedLinks
              };
            })
          };
        }

        return hash;
      }, {});

      if (Object.keys(relationships).length) {
        serialized = {
          ...serialized,
          relationships
        };
      }
    }

    if (links || typeof links !== 'boolean') {
      serialized.links = {
        self: `${domain}/${type}/${id}`
      };
    }

    return serialized;
  }

  /**
   * @private
   */
  formatRelationship({
    item,
    fields,
    domain,
    included
  }: {
    item: Model,
    fields: Array<string>,
    domain: string,
    included: Array<Object>
  }): Object {
    const {
      id,

      constructor: {
        serializer
      }
    } = item;

    let { modelName: type } = item;
    type = pluralize(type);

    if (fields.length) {
      const shouldInclude = !included.some((incl) => {
        return id === incl.id && type === incl.type;
      });

      if (shouldInclude) {
        included.push(
          serializer.formatOne({
            item,
            domain,
            fields,
            include: {},
            included: []
          })
        );
      }
    }

    return {
      data: {
        id,
        type
      },

      links: {
        self: `${domain}/${type}/${id}`
      }
    };
  }
}

export default Serializer;
