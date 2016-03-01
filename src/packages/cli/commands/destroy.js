import Promise from 'bluebird';
import { pluralize } from 'inflection';

import rmrf from '../utils/rmrf';

export async function destroyType(type, name) {
  const pwd = process.env.PWD;

  type = type.toLowerCase();

  if (type !== 'model') {
    name = pluralize(name);
  }

  return await rmrf(`${pwd}/app/${pluralize(type)}/${name}.js`);
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
