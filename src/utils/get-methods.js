import omit from './omit';

const { getPrototypeOf, getOwnPropertyNames } = Object;

export function getClassMethods(target) {
  const methods = {};
  let key, value;

  for (key of getOwnPropertyNames(target)) {
    value = target[key];

    if (typeof value === 'function') {
      methods[key] = value;
    }
  }

  return omit(methods, 'constructor');
}

export function getInstanceMethods(target) {
  const proto = getPrototypeOf(target.prototype);
  const methods = {};
  let key, value;

  for (key of getOwnPropertyNames(proto)) {
    value = proto[key];

    if (typeof value === 'function') {
      methods[key] = value;
    }
  }

  return omit(methods, 'constructor');
}

export default {
  getClassMethods,
  getInstanceMethods
};
