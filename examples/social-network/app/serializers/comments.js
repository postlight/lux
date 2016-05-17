import { Serializer } from 'lux-framework';

class CommentsSerializer extends Serializer {
  attributes = [
    'message',
    'edited'
  ];

  hasOne = [
    'user'
  ];

  hasMany = [
    'reactions'
  ];
}

export default CommentsSerializer;
