import moment from 'moment';
import { red, dim } from 'colors/safe';

import Base from '../base';

import write from './utils/write';

import bound from '../../decorators/bound';
import memoize from '../../decorators/memoize';

class Logger extends Base {
  @memoize
  get file() {
    return `${this.root}/log/${this.environment}.log`;
  }

  get timestamp() {
    return moment().format('M/d/YY h:m:ss A');
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
}

export line from './utils/line';

export default Logger;
