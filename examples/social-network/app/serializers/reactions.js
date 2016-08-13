import { Serializer } from 'lux-framework';

class ReactionsSerializer extends Serializer {
  attributes = [
    'type',
    'createdAt'
  ];

  hasOne = [
    'post',
    'user',
    'comment'
  ];
}

export default ReactionsSerializer;
