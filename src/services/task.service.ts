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
  public executeTask = (taskId: string, callback: any) => {
    TaskModel.findById(taskId)
      .then((foundTask: ITaskAPI | null) => {
        if (foundTask) {
          switch (foundTask.type) {
            case TASK_TYPE.SURVEY:
              break;
            case TASK_TYPE.REMINDER:
              break;
            case TASK_TYPE.CUSTOM_MESSAGE:
              break;
            case TASK_TYPE.RESET:
              break;
            default:
              break;
          }

        } else {
          throw Error(`Task #${taskId} not found`);
        }
      })
      .catch((err: Error) => {
        return err;
      });
  }

}

export const taskService = new TaskService();