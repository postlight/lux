import { Serializer } from '../../../../dist';

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
