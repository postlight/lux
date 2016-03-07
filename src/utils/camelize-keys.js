import { camelize } from 'inflection';

export default function camelizeKeys(obj) {
  const result = {};

  for (let key in obj) {
    result[camelize(key.replace(/-/g, '_'), true)] = obj[key];
  }

  return result;
}
