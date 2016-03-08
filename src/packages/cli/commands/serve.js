import os from 'os';
import cluster from 'cluster';

export default async function serve(port = 4000) {
  const Application = require(`${process.env.PWD}/app`).default;

  if (cluster.isMaster) {
    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    await Application.create({ port }).boot();
  }
}
