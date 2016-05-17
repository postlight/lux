import { Serializer } from 'lux-framework';

class ListsSerializer extends Serializer {
  attributes = [
    'name',
    'createdAt',
    'updatedAt'
  ];

  hasMany = [
    'tasks'
  ];
}

export default ListsSerializer;
