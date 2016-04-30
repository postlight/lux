export default function template(strings, ...values) {
  return strings.reduce((result, part, idx) => {
    const value = values[idx];

    return result + part + (value ? value : '');
  }, '');
}
