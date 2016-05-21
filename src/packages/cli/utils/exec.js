import { exec } from 'child_process';
import { promisify } from 'bluebird';

export default promisify(exec);
