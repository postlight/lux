import inflection from 'inflection';

export default function underscore(str = '', upper = false) {
  return inflection.underscore(str, upper).replace(/-/g, '_');
}
