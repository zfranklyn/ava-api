import {
  ITask,
  ITaskAPI,
  TASK_TYPE,
  TaskType,
} from './../db/sharedTypes';

import {
  TaskModel,
} from './../db/models';

class TaskService {

  /*
    Steps of Executing a Task, given taskId:
    * Retrieve task associated with taskId
    * Retrieve study and statuses associated with task
    * Retrieve participants associated with study
    * Execute task on participants
  */

}

export const taskService = new TaskService();
