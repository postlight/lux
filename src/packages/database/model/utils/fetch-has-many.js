import Promise from 'bluebird';

import formatSelect from './format-select';
import { sql } from '../../../logger';

export default async function fetchHasMany(model, related, records) {
  const {
    tableName,
    primaryKey,

    store: {
      debug
    }
  } = model;

  related = related.reduce((hash, included) => {
    const {
      name,
      attrs,
      relationship: {
        foreignKey,
        model: relatedModel,

        model: {
          table,
          tableName: relatedTableName
        }
      }
    } = included;

    const query = table()
      .select(
        ...formatSelect(relatedModel, attrs, `${name}.`),
        `${relatedTableName}.${foreignKey} AS ${tableName}.${primaryKey}`
      )
      .whereIn(
        `${relatedTableName}.${foreignKey}`,
        records.map(({ [primaryKey]: pk }) => pk)
      );

    if (debug) {
      const { logger } = model;

      query.on('query', () => {
        setImmediate(() => logger.log(sql`${query.toString()}`));
      });
    }

    return {
      ...hash,
      [name]: query
    };
  }, {});

  return await Promise.props(related);
}
