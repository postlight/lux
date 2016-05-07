import { red } from 'colors/safe';
import { pluralize } from 'inflection';

import fs from '../../fs';

import rmrf from '../utils/rmrf';

const { env: { PWD } } = process;

export async function destroyType(type, name) {
  let path;

  type = type.toLowerCase();

  switch (type) {
    case 'model':
      path = `app/${pluralize(type)}/${name}.js`;
      break;

    case 'migration':
      const migrations = await fs.readdirAsync(`${PWD}/db/migrate`);

      name = migrations.find(file => `${name}.js` === file.substr(17));
      path = `db/migrate/${name}`;
      break;

    case 'controller':
    case 'serializer':
      name = pluralize(name);
      path = `app/${pluralize(type)}/${name}.js`;
      break;
  }

  await rmrf(`${PWD}/${path}`);
  console.log(`${red('remove')} ${path}`);
}

export default async function destroy(type, name) {
  if (type === 'resource') {
    await Promise.all([
      destroyType('model', name),
      destroyType('migration', `create-${pluralize(name)}`),
      destroyType('serializer', name),
      destroyType('controller', name)
    ]);
  } else {
    await destroyType(type, name);
  }
}
