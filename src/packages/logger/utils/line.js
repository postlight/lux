import template from './template';

export default function line(strings, ...values) {
  return template(strings, ...values)
    .replace(/(\r\n|\n|\r|)/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}
