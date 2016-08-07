import { CWD } from '../../../constants';
import { red, green } from 'chalk';
import { pluralize, singularize } from 'inflection';

import { rmrf, exists, readdir, readFile, writeFile } from '../../fs';

/**
 * @private
 */
export async function destroyType(type, name) {
  let path;
  let migrations;

  type = type.toLowerCase();

  switch (type) {
    case 'model':
      name = singularize(name);
      path = `app/${pluralize(type)}/${name}.js`;
      break;

    case 'migration':
      migrations = await readdir(`${CWD}/db/migrate`);
      name = migrations.find(file => `${name}.js` === file.substr(17));
      path = `db/migrate/${name}`;
      break;

    case 'controller':
    case 'serializer':
      name = pluralize(name);
      path = `app/${pluralize(type)}/${name}.js`;
      break;

    case 'middleware':
      path = `app/${type}/${name}.js`;
      break;

    case 'util':
      path = `app/${pluralize(type)}/${name}.js`;
      break;
  }

  if (await exists(`${CWD}/${path}`)) {
    await rmrf(`${CWD}/${path}`);
    console.log(`${red('remove')} ${path}`);
  }
}

/**
 * @private
 */
export async function destroy({ type, name }: {
  type: string;
  name: string;
}) {
  if (type === 'resource') {
    const routes = (await readFile(`${CWD}/app/routes.js`, 'utf8'))
      .split('\n')
      .reduce((lines, line) => {
        const pattern = new RegExp(
          `\s*this.resource\\(('|"|\`)${pluralize(name)}('|"|\`)\\);?`
        );

        return pattern.test(line) ? lines : [...lines, line];
      }, '')
      .join('\n');

    await Promise.all([
      destroyType('model', name),
      destroyType('migration', `create-${pluralize(name)}`),
      destroyType('serializer', name),
      destroyType('controller', name)
    ]);

    await writeFile(`${CWD}/app/routes.js`, routes);
    console.log(`${green('update')} app/routes.js`);
  } else if (type === 'model') {
    await Promise.all([
      destroyType(type, name),
      destroyType('migration', `create-${pluralize(name)}`)
    ]);
  } else {
    await destroyType(type, name);
  }
}
