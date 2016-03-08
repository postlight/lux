export default async function serve(port = 4000) {
  const Application = require(`${process.env.PWD}/app`).default;

  return await Application.create({ port }).boot();
}
