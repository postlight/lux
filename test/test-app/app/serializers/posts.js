import { Serializer } from 'LUX_LOCAL';

class PostsSerializer extends Serializer {
  attributes = [
    'body',
    'title',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'user'
  ];

  hasMany = [
    'comments',
    'reactions',
    'tags'
  ];
}

export default PostsSerializer;
