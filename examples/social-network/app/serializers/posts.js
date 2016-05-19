import { Serializer } from 'lux-framework';

class PostsSerializer extends Serializer {
  attributes = [
    'body',
    'title'
  ];

  hasOne = [
    'user'
  ];

  hasMany = [
    'comments',
    'reactions'
  ];
}

export default PostsSerializer;
