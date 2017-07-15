/* @flow */

const DELIMITER = '__INFLECTOR__'
const PATTERN = /(?:[_-\s]|(?:[a-z][A-Z]))+/g

const replacer = token => {
  switch (token.charAt(0)) {
    case '-':
    case '_':
    case ' ':
      return DELIMITER

    default:
      return token.split('').join(DELIMITER)
  }
}

export const tokenize = (value: string): Array<string> =>
  value
    .replace(PATTERN, replacer)
    .split(DELIMITER)
    .map(token => token.toLowerCase())
