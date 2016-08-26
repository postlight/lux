import PostsSerializer from 'app/serializers/posts';

class AdminPostsSerializer extends PostsSerializer {
  attributes = [
    'title',
    'body',
    'isPublic',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'author'
  ];
}

export default AdminPostsSerializer;
