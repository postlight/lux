import { Serializer } from 'LUX_LOCAL';

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
