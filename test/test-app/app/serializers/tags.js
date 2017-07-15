import { Serializer } from 'lux-framework'

class TagsSerializer extends Serializer {
  attributes = [
    'name'
  ];

  hasMany = [
    'posts'
  ];
}

export default TagsSerializer
