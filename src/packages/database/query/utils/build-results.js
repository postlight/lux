// @flow
import { camelize, singularize } from 'inflection';

import Model from '../../model';

import entries from '../../../../utils/entries';
import underscore from '../../../../utils/underscore';
import promiseHash from '../../../../utils/promise-hash';

export default async function buildResults({
  model,
  records,
  relationships
}: {
  model: typeof Model,
  records: Promise<Array<Object>>,
  relationships: Object
}): Promise<Array<Object>> {
  const results = await records;
  const pkPattern = new RegExp(`^.+\.${model.primaryKey}$`);
  let related;

  if (Object.keys(relationships).length) {
    related = entries(relationships)
      .reduce((hash, [name, relationship]) => {
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

          hash[name] = query;
        } else {
          hash[name] = relationship.model
            .select(...relationship.attrs)
            .where({
              [foreignKey]: results.map(({ id }) => id)
            });
        }

        return hash;
      }, {});

    related = await promiseHash(related);
  }

  return results.map((record) => {
    if (related) {
      entries(related)
        .forEach(([name, relatedResults]: [string, Array<Model>]) => {
          const relationship = model.relationshipFor(name);

          if (relationship) {
            let { foreignKey } = relationship;
            foreignKey = camelize(foreignKey, true);

            const match = relatedResults.filter(({ rawColumnData }) => {
              return rawColumnData[foreignKey] === record[model.primaryKey];
            });

            if (match.length) {
              record[name] = match;
            }
          }
        });
    }

    record = entries(record)
      .reduce((r, [key, value]) => {
        if (!value && pkPattern.test(key)) {
          return r;
        } else if (key.indexOf('.') >= 0) {
          const [a, b] = key.split('.');
          let parent: ?Object = r[a];

          if (!parent) {
            parent = {};
          }

          key = a;
          value = {
            ...parent,
            [b]: value
          };
        }

        return {
          ...r,
          [key]: value
        };
      }, {});

    return new model(record);
  });
}
