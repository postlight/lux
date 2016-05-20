import { Serializer } from 'lux-framework';

class UsersSerializer extends Serializer {
  attributes = [
    'name',
    'email'
  ];

  hasMany = [
    'comments',
    'posts',
    'reactions'
  ];
}

export default UsersSerializer;
