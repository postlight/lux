// @flow
import { camelize } from 'inflection';

import { sql } from '../../logger';

import { RecordNotFoundError } from './errors';

import initialize from './initialize';

import entries from '../../../utils/entries';
import tryCatch from '../../../utils/try-catch';
import formatSelect from './utils/format-select';
import buildResults from './utils/build-results';
import getFindParam from './utils/get-find-param';

import type { Model } from '../index'; // eslint-disable-line no-unused-vars

/**
 * @private
 */
class Query {
  /**
   * @private
   */
  model: Class<Model>;

  /**
   * @private
   */
  snapshots: Array<[string, mixed]>;

  /**
   * @private
   */
  isFind: boolean;

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

    return initialize(this);
  }

  all() {
    return this;
  }

  not(conditions: Object = {}) {
    return this.where(conditions, true);
  }

  find(primaryKey: any) {
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

  page(num: number) {
    if (this.shouldCount) {
      return this;
    } else {
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
  }

  limit(amount: number) {
    if (!this.shouldCount) {
      this.snapshots.push(['limit', amount]);
    }

    return this;
  }

  order(attr: string, direction: string = 'ASC') {
    if (!this.shouldCount) {
      const columnName = this.model.columnNameFor(attr);

      if (columnName) {
        this.snapshots = this.snapshots
          .filter(([method]) => method !== 'orderBy')
          .concat([
            ['orderBy', [
              `${this.model.tableName}.${columnName}`,
              direction
            ]]
          ]);
      }
    }

    return this;
  }

  where(conditions: Object = {}, not: boolean = false) {
    const {
      model: {
        tableName
      }
    } = this;

    const where = entries(conditions).reduce((hash, [key, value]) => {
      const columnName = this.model.columnNameFor(key);

      if (columnName) {
        key = `${tableName}.${columnName}`;

        if (typeof value === 'undefined') {
          value = null;
        }

        if (Array.isArray(value)) {
          if (value.length > 1) {
            this.snapshots.push([not ? 'whereNotIn' : 'whereIn', [key, value]]);
          } else {
            hash[key] = value[0];
          }
        } else {
          hash[key] = value;
        }
      }

      return hash;
    }, {});

    if (Object.keys(where).length) {
      this.snapshots.push([not ? 'whereNot' : 'where', where]);
    }

    return this;
  }

  first() {
    if (!this.shouldCount) {
      const willSort = this.snapshots.some(([method]) => method === 'orderBy');

      this.collection = false;

      if (!willSort) {
        this.order(this.model.primaryKey, 'ASC');
      }

      this.limit(1);
    }

    return this;
  }

  last() {
    if (!this.shouldCount) {
      const willSort = this.snapshots.some(([method]) => method === 'orderBy');

      this.collection = false;

      if (!willSort) {
        this.order(this.model.primaryKey, 'DESC');
      }

      this.limit(1);
    }

    return this;
  }

  count() {
    const validName = /^(where(Not)?(In)?)$/g;

    Object.assign(this, {
      shouldCount: true,

      snapshots: [
        ['count', '* as countAll'],
        ...this.snapshots.filter(([name]) => validName.test(name))
      ]
    });

    return this;
  }

  offset(amount: number) {
    if (!this.shouldCount) {
      this.snapshots.push(['offset', amount]);
    }

    return this;
  }

  select(...attrs: Array<string>) {
    if (!this.shouldCount) {
      this.snapshots.push(['select', formatSelect(this.model, attrs)]);
    }

    return this;
  }

  distinct(...attrs: Array<string>) {
    if (!this.shouldCount) {
      this.snapshots.push(['distinct', formatSelect(this.model, attrs)]);
    }

    return this.select();
  }

  include(...relationships: Array<Object|string>) {
    let included;

    if (!this.shouldCount) {
      if (relationships.length === 1 && typeof relationships[0] === 'object') {
        included = entries(relationships[0]).reduce((arr, [name, attrs]) => {
          const opts = this.model.relationshipFor(name);

          if (opts) {
            if (!attrs.length) {
              attrs = opts.model.attributeNames;
            }

            return [...arr, {
              name,
              attrs,
              relationship: opts
            }];
          } else {
            return arr;
          }
        }, []);
      } else {
        included = relationships.reduce((arr, name) => {
          if (typeof name !== 'string') {
            name = name.toString();
          }

          const opts = this.model.relationshipFor(name);

          if (opts) {
            const attrs = opts.model.attributeNames;

            return [...arr, {
              name,
              attrs,
              relationship: opts
            }];
          } else {
            return arr;
          }
        }, []);
      }

      const willInclude = included
        .filter(({
          name,
          attrs,
          relationship
        }) => {
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
          } else {
            return true;
          }
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

  unscope(...scopes: Array<string>) {
    if (scopes.length) {
      scopes = scopes.filter(scope => {
        return scope === 'order' ? 'orderBy' : scope;
      });

      this.snapshots = this.snapshots.filter(([, , scope]) => {
        return typeof scope === 'string' ? scopes.indexOf(scope) < 0 : true;
      });
    } else {
      this.snapshots = this.snapshots.filter(([, , scope]) => !scope);
    }

    return this;
  }

  /**
   * @private
   */
  async run(): Promise<number | ?Model | Array<Model>> {
    let results;

    const {
      model,
      isFind,
      snapshots,
      collection,
      shouldCount,
      relationships
    } = this;

    if (!shouldCount && !snapshots.some(([name]) => name === 'select')) {
      this.select(...this.model.attributeNames);
    }

    const records: any = snapshots.reduce((
      query,
      [name, params]
    ) => {
      if (!shouldCount && name === 'includeSelect') {
        name = 'select';
      }

      const method = Reflect.get(query, name);

      if (!Array.isArray(params)) {
        params = [params];
      }

      return Reflect.apply(method, query, params);
    }, model.table());

    if (model.store.debug) {
      records.on('query', () => {
        setImmediate(() => model.logger.debug(sql`${records.toString()}`));
      });
    }

    if (shouldCount) {
      let [{ countAll: count }] = await records;
      count = parseInt(count, 10);

      return Number.isFinite(count) ? count : 0;
    } else {
      results = await buildResults({
        model,
        records,
        relationships
      });

      if (collection) {
        return results;
      } else {
        const [result] = results;

        if (!result && isFind) {
          throw new RecordNotFoundError(model, getFindParam(this));
        }

        return result;
      }
    }
  }

  then(
    onData: ?(data: number | ?Model | Array<Model>) => void,
    onError: ?(err: Error) => void
  ): Promise<number | ?Model | Array<Model>> {
    return tryCatch(async () => {
      const data = await this.run();

      if (typeof onData === 'function') {
        onData(data);
      }
    }, (err) => {
      if (typeof onError === 'function') {
        onError(err);
      }
    });
  }

  static from(src: any) {
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
