import omit from '../utils/omit';

export default function readonly(target, key, desc) {
  return {
    ...omit(desc, 'get', 'set', 'writable'),
    writable: false
  };
}
