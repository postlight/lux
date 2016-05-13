import fs from '../fs';

export default async function loader(appPath, type) {
  if (type === 'routes') {
    return new Map([
      ['routes', require(`${appPath}/app/routes`).default]
    ]);
  } else {
    return new Map(
      (await fs.readdirAsync(`${appPath}/app/${type}`))
        .map(file => {
          return [
            file.replace('.js', ''),
            require(`${appPath}/app/${type}/${file}`).default
          ];
        })
    );
  }
}
