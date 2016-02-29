export function compact(target = []) {
  return target
    .filter(node => node !== null && node !== undefined);
}

export default function flatten(target = []) {
  const { isArray } = Array;
  const hasArray = target.some(isArray);

  if (hasArray) {
    const result = [];

    target
      .forEach(node => {
        if (isArray(node)) {
          result.push(...node);
        } else {
          result.push(node);
        }
      });
    return flatten(result);
  } else {
    return compact(target);
  }
}
