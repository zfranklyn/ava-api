// tslint:disable
const debug = require('debug')('debug/task.router');
let express = require('express');
// tslint:enable

import {
  UserModel,
  StudyModel,
  TaskModel,
  StatusModel,
 } from '../db/models/index';

import {
  ITask,
 } from './../db/sharedTypes';

const TaskRouter = express.Router();

// get all tasks for a specific Study
TaskRouter.get('/:id', (req: any, res: any, next: any) => {
  const studyId = req.params.id;

  TaskModel.findAll({
    where: {
      studyId,
    },
    include: [{model: StatusModel, as: 'SurveyStatus'}],
  })
    .then((tasksFromStudy) => {
      res.json(tasksFromStudy);
    });
});

TaskRouter.post('/:id', (req: any, res: any, next: any) => {
  const { timestamp, type, message, medium, studyId } = req.body;

  TaskModel.create({
    timestamp, type, message, medium,
    completed: false,
    studyId,
  })
    .then((createdTask) => {
      res.json(createdTask);
    });
});

export { TaskRouter };
