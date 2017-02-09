// @flow
import { camelize, singularize } from 'inflection';

// eslint-disable-next-line no-unused-vars
import Model from '../../../model';
import entries from '../../../../../utils/entries';
import underscore from '../../../../../utils/underscore';
import promiseHash from '../../../../../utils/promise-hash';

/**
 * @private
 */
export default async function buildResults<T: Model>({
  model,
  records,
  relationships
}: {
  model: Class<T>,
  records: Promise<Array<Object>>,
  relationships: Object
}): Promise<Array<T>> {
  const results = await records;
  const pkPattern = new RegExp(`^.+\\.${model.primaryKey}$`);
  let related;

  if (!results.length) {
    return [];
  }

  if (Object.keys(relationships).length) {
    related = entries(relationships).reduce((obj, entry) => {
      const result = obj;
      const [name, relationship] = entry;
      let foreignKey = camelize(relationship.foreignKey, true);

      if (relationship.through) {
        const query = relationship.model.select(...relationship.attrs);

        const baseKey = `${relationship.through.tableName}.` +
          `${singularize(underscore(name))}_id`;

        foreignKey = `${relationship.through.tableName}.` +
          `${relationship.foreignKey}`;

        query.snapshots.push(
          ['select', [
            `${baseKey} as ${camelize(baseKey.split('.').pop(), true)}`,
            `${foreignKey} as ${camelize(foreignKey.split('.').pop(), true)}`
          ]],

          ['innerJoin', [
            relationship.through.tableName,
            `${relationship.model.tableName}.` +
              `${relationship.model.primaryKey}`,
            '=',
            baseKey
          ]],

          ['whereIn', [
            foreignKey,
            results.map(({ id }) => id)
          ]]
        );

        result[name] = query;

        return result;
      }

      result[name] = relationship.model
        .select(...relationship.attrs)
        .where({
          [foreignKey]: results.map(({ id }) => id)
        });

      return result;
    }, {});

    related = await promiseHash(related);
  }

  return results.map(record => {
    if (related) {
      const target = record;

      entries(related).forEach(([name, relatedResults]) => {
        const relationship = model.relationshipFor(name);

        if (relationship) {
          let { foreignKey } = relationship;

          foreignKey = camelize(foreignKey, true);
          target[name] = relatedResults.filter(({ rawColumnData }) => (
            rawColumnData[foreignKey] === record[model.primaryKey]
          ));
        }
      });
    }

    // eslint-disable-next-line new-cap
    const instance = new model(
      entries(record).reduce((obj, entry) => {
        const result = obj;
        let [key, value] = entry;

        if (!value && pkPattern.test(key)) {
          return result;
        } else if (key.indexOf('.') >= 0) {
          const [a, b] = key.split('.');
          let parent: ?Object = result[a];

          if (!parent) {
            parent = {};
          }

          key = a;
          value = {
            ...parent,
            [b]: value
          };
        }

        result[key] = value;

        return result;
      }, {})
    );

    instance.currentChangeSet.persist();

    return instance;
  });
}
