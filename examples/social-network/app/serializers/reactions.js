import { Serializer } from 'lux-framework';

class ReactionsSerializer extends Serializer {
  attributes = [
    'type'
  ];

  hasOne = [
    'post',
    'user',
    'comment'
  ];
}

export default ReactionsSerializer;
