import { Serializer } from '../../index';

class PostsSerializer extends Serializer {
  attributes = [
    'title',
    'body',
    'isPublic',
    'createdAt',
    'updatedAt'
  ];
}

export default PostsSerializer;
