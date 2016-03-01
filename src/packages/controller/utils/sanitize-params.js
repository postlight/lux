import pick from '../../../utils/pick';
import omit from '../../../utils/omit';

export default function sanitizeParams(params, keys) {
  const result = omit(params, 'data');

  if (params.data) {
    let { id, type, attributes } = params.data;

    result.data = {};

    if (id) {
      result.data.id = id;
    }

    if (type) {
      result.data.type = type;
    }

    if (attributes) {
      result.data.attributes = pick(attributes, ...keys);
    }
  }

  return result;
}
