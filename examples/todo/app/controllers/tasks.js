import { Controller } from 'lux-framework';

class TasksController extends Controller {
  params = [
    'name',
    'list',
    'dueDate',
    'isCompleted'
  ];
}

export default TasksController;
