// tslint:disable
const debug = require('debug')('debug/action.controller');
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

export const addUserToStudy = async (req: Request, res: Response, next: NextFunction) => {
  const { studyId, userId } = req.query;
  debug(`Request: Add User #${userId} to Study #${studyId}`);
  const study: any = await StudyModel.findById(studyId);
  if (study) {
    const user: any = await UserModel.findById(userId);
    if (user) {
      study.addUsers(user)
      .then(() => {
        debug(`Success: Added User #${userId} to Study #${studyId}`);
        res.sendStatus(200);
      })
      .catch(next);
    } else {
      next(new Error(`User by ID #${userId} not found`));
    }
  } else {
    next(new Error(`Study by ID #${studyId} not found`));
  }
};

export const removeUserFromStudy = async (req: Request, res: Response, next: NextFunction) => {
  const { studyId, userId } = req.query;
  debug(`Request: Removing User #${userId} from Study #${studyId}`);
  const study: any = await StudyModel.findById(studyId);
  if (study) {
    const user: any = await UserModel.findById(userId);
    if (user) {
      study.removeUser(user)
      .then(() => {
        debug(`Success: Removed User #${userId} from Study #${studyId}`);
        res.sendStatus(200);
      })
      .catch(next);
    } else {
      next(new Error(`User by ID #${userId} not found`));
    }
  } else {
    next(new Error(`Study by ID #${studyId} not found`));
  }

};

export const completeEvent = (req: Request, res: Response, next: NextFunction) => {
  const { eventId } = req.query;
  debug(`Request: mark Event ${eventId} as completed`);
  StatusModel.findById(eventId)
    .then((status: any) => {
      return status.updateAttributes({
        completed: true,
        completionTime: new Date(),
      });
    })
    .then((updatedStatus: any) => {
      debug(`Success: Event #${eventId} has been marked as completed`);
      res.status(200);
      res.json(updatedStatus);
    })
    .catch((err: Error) => {
      next(err);
    });
};
