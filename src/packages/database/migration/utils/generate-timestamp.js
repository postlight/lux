// @flow
function formatInt(int: number) {
  return (int / 10).toString().replace('.', '').substr(0, 2);
}

function* padding(char: string, amount: number) {
  for (let i = 0; i < amount; i += 1) {
    yield char;
  }
}

export default function generateTimestamp() {
  const now = new Date();
  const timestamp = now.toISOString()
    .substr(0, 10)
    .split('-')
    .join('')
    + formatInt(now.getHours())
    + formatInt(now.getMinutes())
    + formatInt(now.getSeconds())
    + formatInt(now.getMilliseconds());

  return timestamp + Array.from(padding('0', 16 - timestamp.length)).join('');
}
