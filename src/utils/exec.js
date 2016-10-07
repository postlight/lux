// @flow
import { exec as nativeExec } from 'child_process';

/**
 * @private
 */
export default function exec(cmd: string, opts?: {
  cwd?: string;
  env?: Object;
  uid?: number;
  gid?: number;
  shell?: string;
  timeout?: number;
  encoding?: string;
  maxBuffer?: number;
  killSignal?: string;
}): Promise<[string | Buffer, string | Buffer]> {
  return new Promise((resolve, reject) => {
    nativeExec(cmd, opts, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      resolve([stdout, stderr]);
    });
  });
}
