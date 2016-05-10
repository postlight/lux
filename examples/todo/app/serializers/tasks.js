import { Serializer } from 'lux-framework';

class TasksSerializer extends Serializer {
  attributes = [
    'name',
    'completed',
    'dueDate',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'list'
  ];
}

export default TasksSerializer;
