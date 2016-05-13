import moment from 'moment';
import { dim, red, yellow } from 'colors/safe';

import fs from '../fs';

import write from './utils/write';
import tryCatch from '../../utils/try-catch';

import bound from '../../decorators/bound';
import memoize from '../../decorators/memoize';

const { defineProperties } = Object;

const {
  env: {
    PWD,
    NODE_ENV = 'development'
  }
} = process;

class Logger {
  enabled;
  appPath;

  constructor({ enabled, appPath = PWD } = {}) {
    defineProperties(this, {
      enabled: {
        value: Boolean(enabled),
        writable: false,
        enumerable: true,
        configurable: false
      },

      appPath: {
        value: appPath,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }

  @memoize
  get file() {
    const { appPath } = this;

    return `${appPath}/log/${NODE_ENV}.log`;
  }

  get timestamp() {
    return moment().format('M/D/YY h:m:ss A');
  }

  @bound
  log(message) {
    const { enabled } = this;

    if (enabled) {
      const { file, timestamp } = this;

      message = `${dim(`[${timestamp}]`)} ${message}\n`;

      process.stdout.write(message);
      setImmediate(write, file, message);
    }
  }

  @bound
  error(message) {
    const { enabled } = this;

    if (enabled) {
      const { file, timestamp } = this;

      message = `${red(`[${timestamp}]`)} ${message}\n`;

      process.stderr.write(message);
      setImmediate(write, file, message);
    }
  }

  @bound
  warn(message) {
    const { enabled } = this;

    if (enabled) {
      const { file, timestamp } = this;

      message = `${yellow(`\n\n[${timestamp}] Warning:`)} ${message}\n\n`;

      process.stdout.write(message);
      setImmediate(write, file, message);
    }
  }

  static async create(props) {
    const instance = new this(props);
    const { appPath } = instance;
    let logFileExists = false;

    await tryCatch(() => fs.mkdirAsync(`${appPath}/log`));

    await tryCatch(async () => {
      await fs.accessAsync(`${appPath}/log/${NODE_ENV}.log`);
      logFileExists = true;
    });

    if (!logFileExists) {
      await tryCatch(() => {
        return fs.writeFileAsync(
          `${appPath}/log/${NODE_ENV}.log`,
          '',
          'utf8'
        );
      });
    }

    return instance;
  }
}

export line from './utils/line';
export sql from './utils/sql';
export default Logger;
