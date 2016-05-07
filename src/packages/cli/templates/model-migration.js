import { underscore, pluralize } from 'inflection';

import indent from '../utils/indent';

export default (name, attrs = []) => {
  const table = pluralize(underscore(name));
  let indices = ['id'];

  attrs = attrs
    .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
    .map(attr => attr.split(':'))
    .filter(([, type]) => !/^has-(one|many)$/g.test(type))
    .map(([column, type]) => {
      if (type === 'belongs-to') {
        type = 'integer';
        column = `${column}_id`;

        indices.push(column);
      }

      return [column, type];
    })
    .map(([column, type], index) => {
      return (index ? '' : '\n') + indent(4) + `table.${type}('${column}');`;
    })
    .join('\n');

  indices.push('created_at', 'updated_at');

  indices = '\n' + indices
    .map(column => indent(6) + `'${column}'`)
    .join(',\n') + '\n' + indent(4);

  return `
export function up(schema) {
  return schema.createTable('${table}', table => {
    table.increments('id');${attrs}
    table.timestamps();

    table.index([${indices}]);
  });
}

export function down(schema) {
  return schema.dropTable('${table}');
}

  `.substr(1).trim();
};
