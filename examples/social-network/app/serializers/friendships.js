import { Serializer } from '../../../../index';

class FriendshipsSerializer extends Serializer {
  attributes = [
    'createdAt',
    'updatedAt'
  ];
}

export default FriendshipsSerializer;
