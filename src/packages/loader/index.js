import fs from '../fs';

const { env: { PWD } } = process;

export default async function loader(type) {
  if (type === 'routes') {
    return new Map([
      ['routes', require(`${PWD}/app/routes`).default]
    ]);
  } else {
    return new Map(
      (await fs.readdirAsync(`${PWD}/app/${type}`))
        .map(file => {
          return [
            file.replace('.js', ''),
            require(`${PWD}/app/${type}/${file}`).default
          ];
        })
    );
  }
}
