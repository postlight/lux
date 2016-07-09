import { camelize } from 'inflection';

import Model from '../model';
import { sql } from '../../logger';

import initialize from './initialize';

import entries from '../../../utils/entries';
import tryCatch from '../../../utils/try-catch';
import formatSelect from './utils/format-select';
import buildResults from './utils/build-results';

/**
 * @private
 */
class Query {
  /**
   * @private
   */
  model: typeof Model;

  /**
   * @private
   */
  snapshots: Array<[string, mixed]>;

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

  constructor(model: typeof Model): Query {
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

  all(): Query {
    return this;
  }

  not(conditions: Object = {}): Query {
    return this.where(conditions, true);
  }

  find(primaryKey: string | number): Query {
    this.collection = false;

    this.where({
      [this.model.primaryKey]: primaryKey
    });

    if (!this.shouldCount) {
      this.limit(1);
    }

    return this;
  }

  page(num: number): Query {
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

  limit(amount: number): Query {
    if (!this.shouldCount) {
      this.snapshots.push(['limit', amount]);
    }

    return this;
  }

  order(attr: string, direction: string = 'ASC'): Query {
    if (!this.shouldCount) {
      this.snapshots = this.snapshots
        .filter(([method]) => method !== 'orderBy')
        .concat([
          ['orderBy', [
            `${this.model.tableName}.${this.model.columnNameFor(attr)}`,
            direction
          ]]
        ]);
    }

    return this;
  }

  where(conditions: Object = {}, not: boolean = false): Query {
    const {
      model: {
        tableName
      }
    } = this;

    const where = entries(conditions).reduce((hash, [key, value]) => {
      key = `${tableName}.${this.model.columnNameFor(key)}`;

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

      return hash;
    }, {});

    if (Object.keys(where).length) {
      this.snapshots.push([not ? 'whereNot' : 'where', where]);
    }

    return this;
  }

  first(): Query {
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

  last(): Query {
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

  count(): Query {
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

  offset(amount: number): Query {
    if (!this.shouldCount) {
      this.snapshots.push(['offset', amount]);
    }

    return this;
  }

  select(...attrs: Array<string>): Query {
    if (!this.shouldCount) {
      this.snapshots.push(['select', formatSelect(this.model, attrs)]);
    }

    return this;
  }

  include(...relationships: Array<Object|string>) {
    let included;

    if (!this.shouldCount) {
      if (relationships.length === 1 && typeof relationships[0] === 'object') {
        included = entries(relationships[0]).map(([
          name,
          attrs
        ]: [
          string,
          Array<string>
        ]) => {
          const relationship = this.model.relationshipFor(name);

          if (!attrs.length) {
            attrs = relationship.model.attributeNames;
          }

          return {
            name,
            attrs,
            relationship
          };
        });
      } else {
        included = relationships.map(name => {
          const relationship = this.model.relationshipFor(name);
          const attrs = relationship.model.attributeNames;

          if (typeof name !== 'string') {
            name = name.toString();
          }

          return {
            name,
            attrs,
            relationship
          };
        });
      }

      included = included
        .filter(Boolean)
        .filter(({
          name,
          attrs,
          relationship
        }: {
          name: string,
          attrs: Array<string>,

          relationship: {
            type: string,
            model: Model,
            through: ?Model,
            foreignKey: string
          }
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

      this.snapshots.push(...included);
    }

    return this;
  }

  unscope(...scopes: Array<string>): Query {
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
  async run(): Promise<?Model|Array<Model>|number> {
    let results;

    const {
      model,
      snapshots,
      collection,
      shouldCount,
      relationships
    } = this;

    if (!shouldCount && !snapshots.some(([name]) => name === 'select')) {
      this.select(...this.model.attributeNames);
    }

    const records = snapshots.reduce((query, [name, params]) => {
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
        setImmediate(() => model.logger.info(sql`${records.toString()}`));
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

      return collection ? results : results[0];
    }
  }

  then(
    onData: ?(data: ?(Model | Array<Model>)) => void,
    onError: ?(err: Error) => void
  ): Promise<?Model | Array<Model>> {
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

  static from(src: Query): Query {
    const {
      model,
      snapshots,
      collection,
      shouldCount,
      relationships
    } = src;

    const dest = new this(model);

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
