import { Controller } from 'lux-framework';

class TasksController extends Controller {
  params = [
    'name',
    'dueDate',
    'completed',
    'taskListId'
  ];
}

export default TasksController;
