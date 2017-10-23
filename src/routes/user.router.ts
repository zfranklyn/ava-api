// tslint:disable
const debug = require('debug')('debug/user.router');
let express = require('express');
// tslint:enable

const UserRouter = express.Router();
import * as UserModel from '../db/models/user.model';
import * as StudyModel from '../db/models/study.model';
import * as TaskModel from '../db/models/task.model';

UserRouter.get('/participants', (req: any, res: any, next: any) => {
  const startIndex = req.query.startIndex;
  const num = req.query.num;

  UserModel.UserModel.findAll({
    where: {
      userType: 'PARTICIPANT',
    },
  })
    .then((allUsers: any[]) => {
      res.json(allUsers.slice((startIndex || 0), ((startIndex + num) || allUsers.length)));
    });
});

UserRouter.get('/participants/details', (req: any, res: any, next: any) => {
  const userId = req.query.userId;
  UserModel.UserModel.findAll({
    include: [{all: true}, { model: StudyModel.StudyModel, include: [{model: TaskModel.TaskModel}]}],
    where: {
      id: userId,
    },
  })
    .then((foundUser: any) => {
      res.json(foundUser);
    });
});

UserRouter.get('/researchers', (req: any, res: any, next: any) => {
  UserModel.UserModel.findAll({
    where: {
      userType: 'RESEARCHER',
    },
  })
    .then((allUsers: any[]) => {
      res.json(allUsers);
    });
});

export { UserRouter };
