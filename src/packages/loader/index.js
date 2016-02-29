import fs from 'fs';

import { promisifyAll } from 'bluebird';

const projectRoot = process.env.PWD;

promisifyAll(fs);

export default async function loader(type) {
  if (type === 'routes') {
    return [
      'routes',
      require(`${projectRoot}/app/routes`).default
    ];
  } else {
    return (await fs.readdirAsync(`${projectRoot}/app/${type}`))
      .map(file => {
        return [
          file.replace('.js', ''),
          require(`${projectRoot}/app/${type}/${file}`).default
        ];
      });
  }
}
