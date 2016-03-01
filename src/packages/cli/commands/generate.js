import fs from '../../fs';

import Promise from 'bluebird';
import { pluralize } from 'inflection';

import modelTemplate from '../templates/model';
import serializerTemplate from '../templates/serializer';
import controllerTemplate from '../templates/controller';

export async function generateType(type, name, pwd) {
  let data;

  type = type.toLowerCase();

  switch (type) {
    case 'model':
      data = modelTemplate(name);
      break;

    case 'serializer':
      data = serializerTemplate(name);
      break;

    case 'controller':
      data = controllerTemplate(name);
      break;
  }

  if (type !== 'model' && name !== 'application') {
    name = pluralize(name);
  }

  await fs.writeFile(`${pwd}/app/${pluralize(type)}/${name}.js`, data, 'utf8');

  return data;
}

export default async function generate(type, name, pwd) {
  pwd = pwd ? pwd : process.env.PWD;

  if (type === 'resource') {
    await Promise.all([
      generateType('model', name, pwd),
      generateType('serializer', name, pwd),
      generateType('controller', name, pwd)
    ]);
  } else {
    await generateType(type, name, pwd);
  }
}
