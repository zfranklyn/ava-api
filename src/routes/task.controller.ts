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
  TaskModel.create(req.body)
    .then((createdTask: ITaskAPI | null) => {
      res.json(createdTask);
    })
    .catch((err: Error) => {
      debug(err);
      res.sendStatus(500);
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
