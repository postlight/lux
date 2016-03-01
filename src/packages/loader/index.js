import fs from '../fs';

const pwd = process.env.PWD;

export default async function loader(type) {
  if (type === 'routes') {
    return [
      'routes',
      require(`${pwd}/app/routes`).default
    ];
  } else {
    return (await fs.readdirAsync(`${pwd}/app/${type}`))
      .map(file => {
        return [
          file.replace('.js', ''),
          require(`${pwd}/app/${type}/${file}`).default
        ];
      });
  }
}
