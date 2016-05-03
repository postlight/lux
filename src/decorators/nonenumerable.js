export default function nonenumerable(target, key, desc) {
  return {
    ...desc,
    enumerable: false
  };
}
