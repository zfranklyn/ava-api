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
  debug(`Getting all tasks in DB`);

  TaskModel.findAll()
    .then(res.json)
    .catch((err: Error) => {
      debug(err);
      res.sendStatus(400);
    });
};

export const getTasksForStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  debug(`Getting all tasks for Study #${studyId}`);

  TaskModel.findAll({
    where: {
      studyId,
    },
    include: [{model: StatusModel, as: 'SurveyStatus'}],
  })
    .then((tasksFromStudy: ITaskAPI[]) => {
      res.json(tasksFromStudy);
    })
    .catch((err: Error) => {
      debug(err);
      res.sendStatus(500);
    });
};

export const createTaskForStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  const { type, ParentSurveyTaskId } = req.body;

  // Does the specified study exist?
  StudyModel.findById(studyId)
  .then((foundStudy: IStudyAPI | null) => {

    if (!foundStudy) {
      throw Error(`Study #${studyId} does not exist`);
    }

    TaskModel.create(req.body)
    .then((createdTask: ITaskAPI | null) => {

      if (!createdTask) {
        throw Error('Task could not be created');
      }

      // if this was a reminder, then associate it with the survey
      if (type === TASK_TYPE.REMINDER) {
        debug(`REMINDER, Survey #${foundStudy.id}`);
        TaskModel.findById(ParentSurveyTaskId)
        .then((parentSurveyTask: ITaskAPI | null) => {

          // ensure that the parent survey we're associating with exists
          if (!parentSurveyTask) {
            throw Error(`Parent Survey Task ${ParentSurveyTaskId} does not exist`);
          }

          parentSurveyTask.addReminder(createdTask);
          createdTask.setParentSurveyTask(parentSurveyTask);
        });
      }
      foundStudy.addTask(createdTask);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      debug(err);
      res.status(400).json({error: err});
    });
  })
  .catch((err: Error) => {
    res.status(400).json({error: err});
  });
};

export const updateTask = (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  TaskModel.find({
    where: {
      id: taskId,
    },
  })
    .then((foundTask: ITaskAPI | null) => {
      if (foundTask) {
        foundTask.updateAttributes(req.body)
        .then(res.json)
        .catch((err: Error) => {
          debug(err);
          res.sendStatus(400);
        });
      } else {
        debug(`Task does not exist`);
        res.sendStatus(404);
      }
    })
    .catch((err: Error) => {
      debug(err);
      res.sendStatus(500);
    });
};

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  TaskModel.destroy({
    where: {
      id: taskId,
    },
  })
    .then(() =>  {
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      res.status(400).json({ error: err });
    });
};
