import { Serializer } from '../../../../index';

class UsersSerializer extends Serializer {
  attributes = [
    'name',
    'email',
    'createdAt',
    'updatedAt'
  ];

  hasMany = [
    'posts'
  ];
}

export default UsersSerializer;
