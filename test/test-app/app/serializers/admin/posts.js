import PostsSerializer from 'app/serializers/posts';

class AdminPostsSerializer extends PostsSerializer {
  attributes = [
    'body',
    'title',
    'isPublic',
    'createdAt',
    'updatedAt'
  ];
}

export default AdminPostsSerializer;
