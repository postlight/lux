import os from 'os';
import cluster from 'cluster';

import { cyan } from 'colors/safe';

import Logger from '../../logger';

const pwd = process.env.PWD;
const env = process.env.NODE_ENV || 'development';

export default async function serve(port = 4000) {
  const Application = require(`${pwd}/bin/app`);
  const config = require(`${pwd}/config/environments/${env}`).default;

  const logger = await Logger.create();

  if (config.port) {
    port = config.port;
  }

  if (cluster.isMaster) {
    const total = os.cpus().length;
    let current = 0;

    logger.log(`Starting Lux Server with ${cyan(`${total}`)} worker processes`);

    for (let i = 0; i < total; i++) {
      cluster.fork().once('message', msg => {
        if (msg === 'ready') {
          current++;
          if (current === total) {
            logger.log(`Lux Server listening on port ${cyan(`${port}`)}`);
          }
        }
      });
    }
  } else {
    await new Application({
      ...config,
      port,
      logger
    }).boot();
  }
}
