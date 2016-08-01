import { Serializer } from 'lux-framework';

class CategorizationsSerializer extends Serializer {
  hasOne = [
    'tag',
    'post'
  ];
}

export default CategorizationsSerializer;
