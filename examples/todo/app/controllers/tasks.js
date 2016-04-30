import { Controller } from '../../../../dist';

class TasksController extends Controller {
  params = [
    'name',
    'dueDate',
    'completed',
    'taskListId'
  ];
}

export default TasksController;
