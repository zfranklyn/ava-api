// tslint:disable
const debug = require('debug')('debug/task.controller');
let express = require('express');
// tslint:enable

import {
  UserModel,
  StudyModel,
  TaskModel,
  StatusModel,
 } from '../db/models/index';

import {
  Request,
  Response,
  NextFunction,
} from 'express';

import {
  ITask,
  ITaskAPI,
  IStudyAPI,
  TASK_TYPE,
 } from './../db/sharedTypes';

export const getAllTasks = (req: Request, res: Response, next: NextFunction) => {
  debug(`Request: retrieve all tasks in DB`);

  TaskModel.findAll()
    .then((allTasks: any[]) => {
      debug(`Success: retrieved and sending all ${allTasks.length} tasks in DB`);
      res.json(allTasks);
    })
    .catch((err: Error) => {
      debug(`Failed: could not retrieve all tasks in DB`);
      debug(err);
      next(err);
    });
};

export const getTask = (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  debug(`Request: retrieve Tasks ${taskId} in DB`);

  TaskModel.find({
    where: {
      id: taskId,
    },
    include: [
      // { model: TaskModel, as: 'SurveyStatus'},
    ],
  })
    .then((task: any) => {
      debug(`Success: retrieved Task #${taskId}`);
      res.json(task);
    })
    .catch((err: Error) => {
      debug(`Failed: could not retrieve all tasks in DB`);
      debug(err);
      next(err);
    });
};

export const getTasksForStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  debug(`Request: retrieve all tasks for Study #${studyId}`);

  TaskModel.findAll({
    where: {
      studyId,
    },
    order: [['scheduledTime']],
    include: [{model: StatusModel, as: 'SurveyStatus'}],
  })
    .then((tasksFromStudy: ITaskAPI[]) => {
      debug(`Success: retrieved all ${tasksFromStudy.length} tasks for Study #${studyId}`);
      res.json(tasksFromStudy);
    })
    .catch((err: Error) => {
      debug(`Failed: could not retrieve tasks for Study #${studyId}`);
      debug(err);
      next(err);
    });
};

export const createTaskForStudy = async (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  const { taskType, ParentSurveyTaskId } = req.body;
  debug(`
    Request: create new task for Study #${studyId}
      type: ${taskType}
      ParentSurveyTaskId: ${ParentSurveyTaskId || 'NA'}
  `);
  debug(req.body);

  // Does the specified study exist?
  StudyModel.findById(studyId)
  .then((foundStudy: any | null) => {

    if (!foundStudy) {
      debug(`Failed: Study #${studyId} does not exist`);
      next(new Error(`Study #${studyId} does not exist`));
    }

    TaskModel.create(req.body)
    .then((createdTask: any) => {
      // if this was a reminder, then associate it with the survey
      if (taskType === TASK_TYPE.REMINDER) {
        debug(`Attempting to create Reminder for parent task #${ParentSurveyTaskId}`);
        TaskModel.findById(ParentSurveyTaskId)
        .then((parentSurveyTask: any | null) => {

          // ensure that the parent survey we're associating with exists
          if (!parentSurveyTask) {
            debug(`Failed: Parent task for reminder does not exist`);
            next(new Error(`Parent Survey Task ${ParentSurveyTaskId} does not exist`));
          } else if (parentSurveyTask.dataValues.taskType !== TASK_TYPE.SURVEY) {
            debug(parentSurveyTask);
            debug(`Failed: Parent survey task is not a survey`);
            next(new Error(`Parent survey task for reminder is not a survey`));
          } else {
            Promise.all([parentSurveyTask.addReminder(createdTask),
              createdTask.setParentSurveyTask(parentSurveyTask)])
              .then(() => {
                foundStudy.addTask(createdTask)
                .then(() => {
                  debug(`Success: created reminder associated with survey Task #${parentSurveyTask.id}`);
                  res.json(createdTask);
                })
                .catch((err: Error) => {
                  debug(`Failed: could not associate task with survey`);
                  next(err);
                });
              })
              .catch((err: Error) => {
                debug(`Failed: could not create reminder`);
                debug(err);
                next(err);
              });
          }
        });
      } else {
        foundStudy.addTask(createdTask)
        .then((updatedStudy: any) => {
          res.json(createdTask);
        })
        .catch((err: Error) => {
          debug(err);
          next(err);
        });
      }
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
  })
  .catch((err: Error) => {
    next(err);
  });
};

export const updateTask = (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  debug(`Request: update task #${taskId}`);
  TaskModel.find({
    where: {
      id: taskId,
    },
  })
    .then((foundTask: any | null) => {
      if (foundTask) {
        foundTask.updateAttributes(req.body)
        .then((updatedTask: any) => {
          debug(`Success: task updated`);
          res.json(updatedTask);
        })
        .catch((err: Error) => {
          debug(`Failed: task could not be updated`);
          debug(err);
          next(err);
        });
      } else {
        debug(`Failed: Task #${taskId} does not exist`);
        next(new Error(`Task #${taskId} does not exist`));
      }
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  debug(`Request: delete task #${taskId}`);
  TaskModel.destroy({
    where: {
      id: taskId,
    },
  })
    .then(() =>  {
      debug(`Success: task #${taskId} has been deleted`);
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      next(err);
    });
};

// This process can also be written 'asynchronously' with `async` and `await`
export const getStatuses = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  debug(`Request: retrieve all statuses associated with Task #${taskId}`);
  const task: any = await TaskModel.findById(taskId);
  if (task) {
    let surveyStatuses: any[] = await task.getSurveyStatus();
    surveyStatuses = surveyStatuses.map((d: any) => d.dataValues);
    debug(`Success: sending all ${surveyStatuses.length} statuses associated with Task #${taskId}`);
    res.json(surveyStatuses);
  } else {
    const newError = new Error(`Task with ID #${taskId} not found`);
    debug(newError);
    next(newError);
  }
};
