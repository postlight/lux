import pick from '../../../utils/pick';

export default function sanitizeParams(params, keys) {
  const result = {};

  if (params.data) {
    let { id, type, attributes } = params.data;

    if (id) {
      result.id = id;
    }

    if (type) {
      result.type = type;
    }

    if (attributes) {
      result.attributes = pick(attributes, ...keys);
    }
  }

  return result;
}
