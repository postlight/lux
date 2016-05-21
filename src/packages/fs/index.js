import fs from 'fs';
import { promisifyAll } from 'bluebird';

export default promisifyAll(fs);
export rmrf from './utils/rmrf';
export exists from './utils/exists';
export isJSFile from './utils/is-js-file';
