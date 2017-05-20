import { Serializer } from 'LUX_LOCAL'

class CategorizationsSerializer extends Serializer {
  hasOne = [
    'tag',
    'post'
  ];
}

export default CategorizationsSerializer
