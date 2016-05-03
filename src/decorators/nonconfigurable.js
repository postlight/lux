export default function nonconfigurable(target, key, desc) {
  return {
    ...desc,
    configurable: false
  };
}
