// @flow
import { pluralize } from 'inflection';

import template from '../../template';
import chain from '../../../utils/chain';
import indent from '../utils/indent';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default (name: string, attrs: Array<string> | string): string => {
  const indices = ['id'];
  const table = chain(name)
    .pipe(str => str.substr(24))
    .pipe(underscore)
    .pipe(pluralize)
    .value();

  let body = '';

  if (Array.isArray(attrs)) {
    body = attrs
      .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
      .map(attr => attr.split(':'))
      .filter(([, type]) => !/^has-(one|many)$/g.test(type))
      .map(attr => {
        let [column, type] = attr;

        column = underscore(column);

        if (type === 'belongs-to') {
          type = 'integer';
          column = `${column}_id`;

          if (Array.isArray(indices)) {
            indices.push(column);
          }
        }

        return [column, type];
      })
      .map((attr, index) => {
        let [column] = attr;
        const [, type] = attr;
        const shouldIndex = indices.indexOf(column) >= 0;

        column = `${indent(index > 0 ? 8 : 0)}table.${type}('${column}')`;
        return shouldIndex ? `${column}.index();` : `${column};`;
      })
      .join('\n');
  }

  return template`
    export function up(schema) {
      return schema.createTable('${table}', table => {
        table.increments('id');
        ${body}
        table.timestamps();

        table.index('created_at');
        table.index('updated_at');
      });
    }

    export function down(schema) {
      return schema.dropTable('${table}');
    }
  `;
};
