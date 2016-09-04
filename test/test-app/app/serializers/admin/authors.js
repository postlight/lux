import AuthorsSerializer from 'app/serializers/authors.js';

class AdminAuthorsSerializer extends AuthorsSerializer {
  attributes = [
    'name',
    'createdAt',
    'updatedAt'
  ];
}

export default AdminAuthorsSerializer;
