// tslint:disable
const debug = require('debug')('debug/user.router');
let express = require('express');
// tslint:enable

const UserRouter = express.Router();
import {
  UserModel,
  StudyModel,
  TaskModel,
 } from '../db/models/index';

UserRouter.get('/', (req: any, res: any, next: any) => {
  const startIndex = req.query.startIndex || 0;
  const num = req.query.num || 50;

  UserModel.findAll({
    where: {
      userType: 'PARTICIPANT',
    },
  })
    .then((allUsers: any[]) => {
      res.json(allUsers.slice((startIndex), ((startIndex + num) || allUsers.length)));
    });
});

UserRouter.get('/participants/details', (req: any, res: any, next: any) => {
  const userId = req.query.userId;
  UserModel.findAll({
    include: [{all: true}, { model: StudyModel, include: [{model: TaskModel}]}],
    where: {
      id: userId,
    },
  })
    .then((foundUser: any) => {
      res.json(foundUser);
    });
});

UserRouter.get('/researchers', (req: any, res: any, next: any) => {
  UserModel.findAll({
    where: {
      userType: 'RESEARCHER',
    },
  })
    .then((allUsers: any[]) => {
      res.json(allUsers);
    });
});

export { UserRouter };
