import fs from '../fs';

const pwd = process.env.PWD;

export default async function loader(type) {
  if (type === 'routes') {
    return new Map([
      ['routes', require(`${pwd}/app/routes`).default]
    ]);
  } else {
    return new Map(
      (await fs.readdirAsync(`${pwd}/app/${type}`))
        .map(file => {
          return [
            file.replace('.js', ''),
            require(`${pwd}/app/${type}/${file}`).default
          ];
        })
    );
  }
}
