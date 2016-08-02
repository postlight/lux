import { Serializer } from 'lux-framework';

class CommentsSerializer extends Serializer {
  attributes = [
    'edited',
    'message'
  ];

  hasOne = [
    'post',
    'user'
  ];

  hasMany = [
    'reactions'
  ];
}

export default CommentsSerializer;
