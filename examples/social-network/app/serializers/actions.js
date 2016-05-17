import { Serializer } from 'lux-framework';

class ActionsSerializer extends Serializer {
  attributes = [
    'trackableId',
    'trackableType'
  ];
}

export default ActionsSerializer;
