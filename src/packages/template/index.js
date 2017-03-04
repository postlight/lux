/* @flow */

import insertValues from './utils/insert-values';

const bodyPattern = /^\n([\s\S]+)\s{2}$/gm;
const trailingWhitespace = /\s+$/;

/**
 * @private
 */
export default function template(
  strings: Array<string>,
  ...values: Array<mixed>
): string {
  const compiled = insertValues(strings, ...values);
  let [body] = compiled.match(bodyPattern) || [];
  let indentLevel = /^\s{0,4}(.+)$/g;

  if (!body) {
    body = compiled;
    indentLevel = /^\s{0,2}(.+)$/g;
  }

  return body.split('\n')
    .slice(1)
    .map(line => {
      let str = line.replace(indentLevel, '$1');

      if (trailingWhitespace.test(str)) {
        str = str.replace(trailingWhitespace, '');
      }

      return str;
    })
    .join('\n');
}

export { default as insertValues } from './utils/insert-values';
