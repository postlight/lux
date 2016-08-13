import { Serializer } from 'lux-framework';

class FriendshipsSerializer extends Serializer {
  attributes = [
    'followerId',
    'followeeId',
    'createdAt',
    'updatedAt'
  ];
}

export default FriendshipsSerializer;
