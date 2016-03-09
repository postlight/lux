import os from 'os';
import cluster from 'cluster';

import { cyan } from 'colors/safe';

import Logger from '../../logger';

const pwd = process.env.PWD;
const env = process.env.NODE_ENV;

export default async function serve(port = 4000) {
  const Application = require(`${pwd}/app`).default;
  const config = require(`${pwd}/config/environments/${env}.json`);
  const logger = Logger.create();
  let workers = 0;

  if (config.port) {
    port = config.port;
  }

  if (cluster.isMaster) {
    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork().once('online', () => {
        workers++;
        if (i === workers) {
          logger.log(`Lux Server listening on port ${cyan(`${port}`)}`);
        }
      });
    }
  } else {
    await Application.create({
      ...config,
      port,
      logger
    }).boot();
  }
}
