import { Serializer } from 'lux-framework';

class TaskListsSerializer extends Serializer {
  attributes = [
    'name',
    'createdAt',
    'updatedAt'
  ];

  hasMany = [
    'tasks'
  ];
}

export default TaskListsSerializer;
