import template from './template';

export default function sql(strings, ...values) {
  return template(strings, ...values)
    .split(' ')
    .map(part => /(,?`|').+(`|'),?/g.test(part) ? part : part.toUpperCase())
    .join(' ');
}
