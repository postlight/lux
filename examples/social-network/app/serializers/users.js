import { Serializer } from 'lux-framework';

class UsersSerializer extends Serializer {
  attributes = [
    'name',
    'email'
  ];

  hasMany = [
    'posts',
    'comments',
    'followees',
    'followers',
    'reactions'
  ];
}

export default UsersSerializer;
