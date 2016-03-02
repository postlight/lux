import { Serializer } from '../../../../index';

class LikesSerializer extends Serializer {
  attributes = [
    'likeableId',
    'likeableType',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'action',
    'user'
  ];
}

export default LikesSerializer;
