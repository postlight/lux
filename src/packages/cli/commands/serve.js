import os from 'os';
import cluster from 'cluster';

const pwd = process.env.PWD;
const env = process.env.NODE_ENV;

export default async function serve(port = 4000) {
  const Application = require(`${pwd}/app`).default;
  const config = require(`${pwd}/config/environments/${env}.json`);

  if (cluster.isMaster) {
    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    await Application.create({ ...config, port }).boot();
  }
}
