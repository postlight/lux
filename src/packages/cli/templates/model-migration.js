// @flow
import { pluralize } from 'inflection';

import template from '../../template';

import indent from '../utils/indent';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default (name: string, attrs: Array<string> | string): string => {
  const table = pluralize(underscore(name));
  const indices = ['id'];

  if (!attrs) {
    attrs = [];
  }

  if (Array.isArray(attrs)) {
    attrs = attrs
      .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
      .map(attr => attr.split(':'))
      .filter(([, type]) => !/^has-(one|many)$/g.test(type))
      .map(([column, type]) => {
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
      .map(([column, type], index) => {
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
        ${attrs}
        table.timestamps();

        table.index([
          'id',
          'created_at',
          'updated_at'
        ]);
      });
    }

    export function down(schema) {
      return schema.dropTable('${table}');
    }
  `;
};
