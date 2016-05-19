import { Serializer } from 'lux-framework';

class CommentsSerializer extends Serializer {
  attributes = [
    'message',
    'edited'
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
