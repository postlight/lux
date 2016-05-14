import indent from '../utils/indent';

export default (name, driver = 'sqlite3') => {
  let username;
  let template = 'export default {\n';

  name = name.replace('-', '_');

  if (driver === 'pg') {
    username = 'postgres';
  } else if (driver !== 'pg' && driver !== 'sqlite3') {
    username = 'root';
  }

  ['development', 'test', 'production'].forEach(environment => {
    template += (indent(2) + `${environment}: {\n`);

    if (driver !== 'sqlite3') {
      template += (indent(4) + 'pool: 5,\n');
    }

    template += (indent(4) + `driver: '${driver}',\n`);

    if (username) {
      template += (indent(4) + `username: '${username}',\n`);
    }

    switch (environment) {
      case 'development':
        template += (indent(4) + `database: '${name}_dev'\n`);
        break;

      case 'test':
        template += (indent(4) + `database: '${name}_test'\n`);
        break;

      case 'production':
        template += (indent(4) + `database: '${name}_prod'\n`);
        break;
    }

    template += (indent(2) + '}');

    if (environment !== 'production') {
      template += ',\n\n';
    }
  });

  template += '\n};';

  return template;
};
