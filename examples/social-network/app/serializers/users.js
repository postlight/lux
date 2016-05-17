import { Serializer } from 'lux-framework';

class UsersSerializer extends Serializer {
  attributes = [
    'name',
    'email'
  ];

  hasMany = [
    'comments',
    'notifications',
    'posts',
    'reactions'
  ];
}

export default UsersSerializer;
