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

// Gets truncated version of studies
StudyRouter.get('/all', (req: any, res: any, next: any) => {
  StudyModel.findAll()
    .then((allStudies) => {
      res.json(allStudies);
    });
});

StudyRouter.get('/all/fullData', (req: any, res: any, next: any) => {
  StudyModel.findAll({
    include: [TaskModel, UserModel],
  })
    .then((allStudies: any[]) => {
      res.json(allStudies);
    });
});

StudyRouter.get('/detail/:id', (req: any, res: any, next: any) => {
  const studyId = req.params.id;
  StudyModel.find({
    where: { id: studyId},
    include: [TaskModel, UserModel],
  })
    .then((allStudies) => {
      res.json(allStudies);
    });
});

export { StudyRouter };
