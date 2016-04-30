import { red } from 'colors/safe';
import { pluralize } from 'inflection';

import rmrf from '../utils/rmrf';

export async function destroyType(type, name) {
  const pwd = process.env.PWD;
  let path;

  type = type.toLowerCase();

  if (type !== 'model') {
    name = pluralize(name);
  }

  path = `app/${pluralize(type)}/${name}.js`;
  await rmrf(`${pwd}/${path}`);

  console.log(`${red('remove')} ${path}`);
}

export default async function destroy(type, name) {
  if (type === 'resource') {
    await Promise.all([
      destroyType('model', name),
      destroyType('serializer', name),
      destroyType('controller', name)
    ]);
  } else {
    await destroyType(type, name);
  }
}
