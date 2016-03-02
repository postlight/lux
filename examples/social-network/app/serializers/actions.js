import { Serializer } from '../../../../index';

class ActionsSerializer extends Serializer {
  attributes = [
    'trackableId',
    'trackableType',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'user'
  ];
}

export default ActionsSerializer;
