import { Controller } from '../../../../index';

class TasksController extends Controller {
  params = [
    'name',
    'completed',
    'dueDate',
    'taskListId'
  ];
}

export default TasksController;
