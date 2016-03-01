import { exec } from 'child_process';

import { promisify } from 'bluebird';

const execAsync = promisify(exec);

export default execAsync;
