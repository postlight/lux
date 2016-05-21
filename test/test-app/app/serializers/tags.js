import { Serializer } from '../../../../dist';

class TagsSerializer extends Serializer {
  attributes = [
    'name'
  ];

  hasOne = [
    'post'
  ];
}

export default TagsSerializer;
