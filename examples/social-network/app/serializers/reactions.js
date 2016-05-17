import { Serializer } from 'lux-framework';

class ReactionsSerializer extends Serializer {
  attributes = [
    'type'
  ];

  hasOne = [
    'user',
    'post',
    'comment'
  ];
}

export default ReactionsSerializer;
