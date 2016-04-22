import { Serializer } from '../../../../dist';

class AuthorsSerializer extends Serializer {
  attributes = [
    'name',
    'createdAt'
  ];
}

export default AuthorsSerializer;
