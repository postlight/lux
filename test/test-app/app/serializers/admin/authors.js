import AuthorsSerializer from 'app/serializers/authors';

class AdminAuthorsSerializer extends AuthorsSerializer {
  attributes = [
    'name',
    'createdAt',
    'updatedAt'
  ];
}

export default AdminAuthorsSerializer;
