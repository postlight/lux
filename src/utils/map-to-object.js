export default function mapToObject(map) {
  const result = {};

  for (let [key, value] of map) {
    result[key] = value;
  }

  return result;
}
