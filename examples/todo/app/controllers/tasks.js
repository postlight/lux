import { Controller } from 'lux-framework';

class TasksController extends Controller {
  params = [
    'name',
    'isCompleted',
    'dueDate'
  ];
}

export default TasksController;
