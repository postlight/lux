import pick from '../../../utils/pick';

export default function sanitizeParams(params, keys) {
  let { id, type, attributes } = params;
  const result = {};

  if (id) {
    result.id = id;
  }

  if (type) {
    result.type = type;
  }

  if (attributes) {
    result.attributes = pick(attributes, ...keys);
  }

  return result;
}
