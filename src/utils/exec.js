import { exec } from 'child_process';
import { promisify } from 'bluebird';

/**
 * @private
 */
export default promisify(exec);
