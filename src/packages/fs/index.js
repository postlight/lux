import fs from 'fs';

import { promisifyAll } from 'bluebird';

promisifyAll(fs);

export default fs;
export isJSFile from './utils/is-js-file';
