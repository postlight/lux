// @flow
import { camelize } from 'inflection';

import entries from '../../../utils/entries';
import uniq from '../../../utils/uniq';
import type Model from '../model';

import scopesFor from './utils/scopes-for';
import formatSelect from './utils/format-select';
import { runQuery, createRunner } from './runner';

/**
 * @class Query
 * @extends Promise
 * @private
 */
class Query<+T: any> extends Promise {
  /**
   * @private
   */
  model: Class<Model>;

  /**
   * @private
   */
  isFind: boolean;

  /**
   * @private
   */
  snapshots: Array<Array<any>>;

  /**
   * @private
   */
  collection: boolean;

  /**
   * @private
   */
  shouldCount: boolean;

  /**
   * @private
   */
  relationships: Object;

  constructor(model: Class<Model>) {
    let resolve;
    let reject;

    super((res, rej) => {
      resolve = res;
      reject = rej;
    });

    createRunner(this, {
      resolve,
      reject
    });

    Object.defineProperties(this, {
      model: {
        value: model,
        writable: false,
        enumerable: false,
        configurable: false
      },

      collection: {
        value: true,
        writable: true,
        enumerable: false,
        configurable: false
      },

      snapshots: {
        value: [],
        writable: true,
        enumerable: false,
        configurable: false
      },

      shouldCount: {
        value: false,
        writable: true,
        enumerable: false,
        configurable: false
      },

      relationships: {
        value: {},
        writable: true,
        enumerable: false,
        configurable: false
      }
    });

    Object.defineProperties(this, scopesFor(this));
  }

  // $FlowIgnore
  static get [Symbol.species]() {
    return Promise;
  }

  all(): this {
    return this;
  }

  not(conditions: Object = {}): this {
    return this.where(conditions, true);
  }

  find(primaryKey: any): this {
    Object.assign(this, {
      isFind: true,
      collection: false
    });

    this.where({
      [this.model.primaryKey]: primaryKey
    });

    if (!this.shouldCount) {
      this.limit(1);
    }

    return this;
  }

  page(num: number): this {
    if (this.shouldCount) {
      return this;
    }

    let limit = this.snapshots.find(([name]) => name === 'limit');

    if (limit) {
      [, limit] = limit;
    }

    if (typeof limit !== 'number') {
      limit = 25;
    }

    this.limit(limit);

    return this.offset(Math.max(parseInt(num, 10) - 1, 0) * limit);
  }

  limit(amount: number): this {
    if (!this.shouldCount) {
      this.snapshots.push(['limit', amount]);
    }

    return this;
  }

  order(attr: string, direction: string = 'ASC'): this {
    if (!this.shouldCount) {
      const columnName = this.model.columnNameFor(attr);

      if (columnName) {
        this.snapshots = this.snapshots
          .filter(([method]) => method !== 'orderByRaw')
          .concat([
            ['orderByRaw', uniq([columnName, this.model.primaryKey])
              .map(key => `${this.model.tableName}.${key} ${direction}`)
              .join(', ')
            ]
          ]);
      }
    }

    return this;
  }

  where(conditions: Object = {}, not: boolean = false): this {
    const {
      model: {
        tableName
      }
    } = this;

    const where = entries(conditions).reduce((obj, condition) => {
      let [key, value] = condition;
      const columnName = this.model.columnNameFor(key);

      if (columnName) {
        key = `${tableName}.${columnName}`;

        if (typeof value === 'undefined') {
          value = null;
        }

        if (Array.isArray(value)) {
          if (value.length === 1) {
            return {
              ...obj,
              [key]: value[0]
            };
          }

          this.snapshots.push([
            not ? 'whereNotIn' : 'whereIn',
            [key, value]
          ]);
        } else if (value === null) {
          this.snapshots.push([
            not ? 'whereNotNull' : 'whereNull',
            [key]
          ]);
        } else {
          return {
            ...obj,
            [key]: value
          };
        }
      }

      return obj;
    }, {});

    if (Object.keys(where).length) {
      this.snapshots.push([not ? 'whereNot' : 'where', where]);
    }

    return this;
  }

  whereBetween(conditions: Object, not: boolean = false): this {
    const {
      model: {
        tableName
      }
    } = this;

    entries(conditions).forEach((condition) => {
      let [key] = condition;
      const [, value] = condition;
      const columnName = this.model.columnNameFor(key);

      if (columnName) {
        key = `${tableName}.${columnName}`;

        if (Array.isArray(value)) {
          this.snapshots.push([
            `where${not ? 'NotBetween' : 'Between'}`,
            [key, value]
          ]);
        }
      }
    });

    return this;
  }

  whereRaw(query: string, bindings: Array<any> = []): this {
    this.snapshots.push(['whereRaw', [query, bindings]]);
    return this;
  }

  first(): this {
    if (!this.shouldCount) {
      const willSort = this.snapshots.some(
        ([method]) => method === 'orderByRaw'
      );

      this.collection = false;

      if (!willSort) {
        this.order(this.model.primaryKey, 'ASC');
      }

      this.limit(1);
    }

    return this;
  }

  last(): this {
    if (!this.shouldCount) {
      const willSort = this.snapshots.some(
        ([method]) => method === 'orderByRaw'
      );

      this.collection = false;

      if (!willSort) {
        this.order(this.model.primaryKey, 'DESC');
      }

      this.limit(1);
    }

    return this;
  }

  count(): Query<number> {
    const validName = /^(where(((Not)?(In)?)|(Raw)|(Between)))$/g;

    Object.assign(this, {
      shouldCount: true,

      snapshots: [
        ['count', '* as countAll'],
        ...this.snapshots.filter(([name]) => validName.test(name))
      ]
    });

    return this;
  }

  offset(amount: number): this {
    if (!this.shouldCount) {
      this.snapshots.push(['offset', amount]);
    }

    return this;
  }

  select(...attrs: Array<string>): this {
    if (!this.shouldCount) {
      this.snapshots.push(['select', formatSelect(this.model, attrs)]);
    }

    return this;
  }

  distinct(...attrs: Array<string>): this {
    if (!this.shouldCount) {
      this.snapshots.push(['distinct', formatSelect(this.model, attrs)]);
    }

    return this.select();
  }

  include(...relationships: Array<Object | string>): this {
    let included;

    if (!this.shouldCount) {
      if (relationships.length === 1 && typeof relationships[0] === 'object') {
        included = entries(relationships[0]).reduce((arr, relationship) => {
          const [name] = relationship;
          const opts = this.model.relationshipFor(name);
          let [, attrs] = relationship;

          if (opts) {
            if (!attrs.length) {
              attrs = opts.model.attributeNames;
            }

            return [...arr, {
              name,
              attrs,
              relationship: opts
            }];
          }

          return arr;
        }, []);
      } else {
        included = relationships.reduce((arr, name) => {
          let str = name;

          if (typeof str !== 'string') {
            str = String(str);
          }

          const opts = this.model.relationshipFor(str);

          if (opts) {
            const attrs = opts.model.attributeNames;

            return [...arr, {
              attrs,
              name: str,
              relationship: opts
            }];
          }

          return arr;
        }, []);
      }

      const willInclude = included
        .filter(opts => {
          const { name, relationship } = opts;
          let { attrs } = opts;

          if (relationship.type === 'hasMany') {
            attrs = relationship.through ? attrs : [
              ...attrs,
              camelize(relationship.foreignKey, true)
            ];

            this.relationships[name] = {
              attrs,
              type: 'hasMany',
              model: relationship.model,
              through: relationship.through,
              foreignKey: relationship.foreignKey
            };

            return false;
          }

          return true;
        })
        .reduce((arr, { name, attrs, relationship }) => {
          arr.push([
            'includeSelect',
            formatSelect(relationship.model, attrs, `${name}.`)
          ]);

          if (relationship.type === 'belongsTo') {
            arr.push(['leftOuterJoin', [
              relationship.model.tableName,
              `${this.model.tableName}.${relationship.foreignKey}`,
              '=',
              `${relationship.model.tableName}.` +
                `${relationship.model.primaryKey}`
            ]]);
          } else if (relationship.type === 'hasOne') {
            arr.push(['leftOuterJoin', [
              relationship.model.tableName,
              `${this.model.tableName}.${this.model.primaryKey}`,
              '=',
              `${relationship.model.tableName}.${relationship.foreignKey}`
            ]]);
          }

          return arr;
        }, []);

      this.snapshots.push(...willInclude);
    }

    return this;
  }

  unscope(...scopes: Array<string>): this {
    if (scopes.length) {
      const keys = scopes.map(scope => {
        if (scope === 'order') {
          return 'orderByRaw';
        }

        return scope;
      });

      this.snapshots = this.snapshots.filter(([, , scope]) => {
        if (typeof scope === 'string') {
          return keys.indexOf(scope) < 0;
        }

        return true;
      });
    } else {
      this.snapshots = this.snapshots.filter(([, , scope]) => !scope);
    }

    return this;
  }

  then<U>(
    onFulfilled?: (value: T) => Promise<U> | U,
    onRejected?: (error: Error) => Promise<U> | U
  ): Promise<U> {
    runQuery(this);
    return super.then(onFulfilled, onRejected);
  } // eslint-disable-line brace-style

  catch<U>(onRejected?: (error: Error) => ?Promise<U> | U): Promise<U> {
    runQuery(this);
    return super.catch(onRejected);
  }

  static from(src: any): Query<T> {
    const {
      model,
      snapshots,
      collection,
      shouldCount,
      relationships
    } = src;

    const dest = Reflect.construct(this, [model]);

    Object.assign(dest, {
      snapshots,
      collection,
      shouldCount,
      relationships
    });

    return dest;
  }
}

export default Query;
export { RecordNotFoundError } from './errors';
