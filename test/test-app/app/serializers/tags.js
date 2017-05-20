import { Serializer } from 'LUX_LOCAL'

class TagsSerializer extends Serializer {
  attributes = [
    'name'
  ];

  hasMany = [
    'posts'
  ];
}

export default TagsSerializer
