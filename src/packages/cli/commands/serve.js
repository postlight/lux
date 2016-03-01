export default async function serve(port = 4000) {
  const Application = require(`${process.env.PWD}/app`).default;
  const app = Application.create({ port });

  return await app.boot();
}
