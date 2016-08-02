import { Serializer } from 'lux-framework';

class TasksSerializer extends Serializer {
  attributes = [
    'name',
    'dueDate',
    'createdAt',
    'updatedAt',
    'isCompleted'
  ];

  hasOne = [
    'list'
  ];
}

export default TasksSerializer;
