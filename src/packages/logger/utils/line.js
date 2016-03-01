export default function line(strings, ...values) {
  let result = '';

  for (let i = 0; i < strings.length; i++) {
    result += strings[i];

    if (values[i]) {
      result += values[i];
    }
  }

  return result.replace(/(\r\n|\n|\r|)/gm, '').replace(/\s+/g, ' ').trim();
}
