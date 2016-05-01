import moment from 'moment';
import { dim, red, yellow } from 'colors/safe';

import Base from '../base';
import fs from '../fs';

import write from './utils/write';
import tryCatch from '../../utils/try-catch';

import bound from '../../decorators/bound';
import memoize from '../../decorators/memoize';

class Logger extends Base {
  @memoize
  get file() {
    return `${this.root}/log/${this.environment}.log`;
  }

  get timestamp() {
    return moment().format('M/D/YY h:m:ss A');
  }

  @bound
  log(message) {
    const { file, timestamp } = this;

    message = `${dim(`[${timestamp}]`)} ${message}\n`;

    process.stdout.write(message);
    setImmediate(write, file, message);
  }

  @bound
  error(message) {
    const { file, timestamp } = this;

    message = `${red(`[${timestamp}]`)} ${message}\n`;

    process.stderr.write(message);
    setImmediate(write, file, message);
  }

  @bound
  warn(message) {
    const { file, timestamp } = this;

    message = `${yellow(`\n\n[${timestamp}] Warning:`)} ${message}\n\n`;

    process.stdout.write(message);
    setImmediate(write, file, message);
  }

  static async create(props) {
    const instance = super.create(props);
    const { root, environment } = instance;
    let logFileExists = false;

    await tryCatch(async () => {
      await fs.mkdirAsync(`${root}/log`);
    }, () => {
      // Do nothing...
    });

    await tryCatch(async () => {
      await fs.accessAsync(`${root}/log/${environment}.log`);
      logFileExists = true;
    }, () => {
      // Do nothing...
    });

    if (!logFileExists) {
      await tryCatch(async () => {
        await fs.writeFileAsync(
          `${root}/log/${environment}.log`,
          '',
          'utf8'
        );
      }, () => {
        // Do nothing...
      });
    }

    return instance;
  }
}

export line from './utils/line';
export sql from './utils/sql';
export default Logger;
