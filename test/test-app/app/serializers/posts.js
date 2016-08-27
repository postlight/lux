import { Serializer } from 'LUX_LOCAL';

class PostsSerializer extends Serializer {
  attributes = [
    'body',
    'title',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'author'
  ];
}

export default PostsSerializer;
