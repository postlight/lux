import exec from '../../cli/utils/exec';

export default function rmrf(path) {
  return exec(`rm -rf ${path}`);
}
