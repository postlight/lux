import Promise from 'bluebird';

import formatSelect from './format-select';
import { sql } from '../../logger';

export default async function fetchHasMany(model, related) {
  const {
    table,
    tableName,
    modelName,
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
        model: relatedModel
      }
    } = included;

    const query = table()
      .select(
        `${tableName}.id AS ${modelName}.id`,
        ...formatSelect(relatedModel, attrs, `${name}.`)
      )
      .innerJoin(
        relatedModel.tableName,
        `${relatedModel.tableName}.${foreignKey}`,
        '=',
        `${tableName}.id`
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
