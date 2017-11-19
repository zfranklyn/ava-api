// tslint:disable
const debug = require('debug')('debug/study.router');
let express = require('express');
// tslint:enable

const StudyRouter = express.Router();
import {
  StudyModel,
  TaskModel,
  UserModel,
} from '../db/models/index';

import { IStudy } from './../db/sharedTypes';

StudyRouter.get('/', (req: any, res: any, next: any) => {
  StudyModel.findAll({
    include: [TaskModel],
  })
    .then((allStudies: any[]) => {
      res.json(allStudies);
    });
});

StudyRouter.get('/study/:id', (req: any, res: any, next: any) => {
  const studyId = req.params.id;
  StudyModel.find({
    where: { id: studyId},
    include: [TaskModel, UserModel],
  })
    .then((allStudies) => {
      res.json(allStudies);
    });
});

StudyRouter.get('/active', (req: any, res: any, next: any) => {
  StudyModel.findAll({
    include: [{model: TaskModel}],
    where: {
      active: true,
    },
  })
    .then((allActiveStudies: any[]) => {
      res.json(allActiveStudies);
    });
});

export { StudyRouter };
