import fs from 'fs';

import { promisifyAll } from 'bluebird';

promisifyAll(fs);

export default fs;
