import { Serializer } from '../../../../dist';

class PostsSerializer extends Serializer {
  attributes = [
    'title',
    'body',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'author'
  ];
}

export default PostsSerializer;
