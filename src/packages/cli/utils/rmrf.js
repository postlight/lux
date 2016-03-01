import exec from './exec';

export default function rmrf(path) {
  return exec(`rm -rf ${path}`);
}
