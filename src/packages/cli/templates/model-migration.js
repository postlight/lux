import { underscore, pluralize } from 'inflection';

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
    .map(([column, type], idx) => {
      let line = `table.${type}('${column}');`;

      if (idx) {
        line = `    ${line}`;
      }

      return line;
    })
    .join('\n');

  indices.push('created_at', 'updated_at');

  indices = indices
    .map((column, idx) => (idx ? '      ' : '') + `'${column}'`)
    .join(',\n');

  return `
export function up(schema) {
  return schema.createTable('${table}', table => {
    table.increments('id');
    ${attrs}
    table.timestamps();

    table.index([
      ${indices}
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('${table}');
}

  `.substr(1).trim();
};
