import { Serializer } from '../../../../dist';

class AuthorsSerializer extends Serializer {
  attributes = [
    'name',
    'createdAt'
  ];

  hasMany = [
    'posts'
  ];
}

export default AuthorsSerializer;
