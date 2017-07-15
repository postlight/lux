/* @flow */

const format = (value: number): string =>
  String(value / 10).replace('.', '').substr(0, 2)

export function* padding(
  char: string,
  amount: number,
): Generator<string, void, void> {
  for (let i = 0; i < amount; i += 1) {
    yield char
  }
}

export const generate = (): string => {
  const now = new Date()
  const timestamp =
    now.toISOString().substr(0, 10).split('-').join('') +
    format(now.getHours()) +
    format(now.getMinutes()) +
    format(now.getSeconds()) +
    format(now.getMilliseconds())

  return timestamp + [...padding('0', 16 - timestamp.length)].join('')
}
