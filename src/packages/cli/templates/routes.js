import { classify, pluralize } from 'inflection';

export default () => {
  return `
export default (route, resource) => {

};
  `.substr(1).trim();
};
