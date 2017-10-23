// tslint:disable
const debug = require('debug')('debug/study.router');
let express = require('express');
// tslint:enable

const StudyRouter = express.Router();
import * as StudyModel from '../db/models/study.model';
import * as TaskModel from '../db/models/task.model';

StudyRouter.get('/', (req: any, res: any, next: any) => {
  StudyModel.StudyModel.findAll({
    include: [TaskModel.TaskModel],
  })
    .then((allStudies: any[]) => {
      res.json(allStudies);
    });
});

StudyRouter.get('/active', (req: any, res: any, next: any) => {
  StudyModel.StudyModel.findAll({
    include: [{model: TaskModel.TaskModel}],
    where: {
      active: true,
    },
  })
    .then((allActiveStudies: any[]) => {
      res.json(allActiveStudies);
    });
});

export { StudyRouter };
