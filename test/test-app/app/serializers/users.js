import { Serializer } from 'LUX_LOCAL';

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
