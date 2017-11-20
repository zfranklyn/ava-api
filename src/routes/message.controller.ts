// tslint:disable
const debug = require('debug')('debug/message.router');
// tslint:enable

import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';

import {
  StudyModel,
  TaskModel,
  UserModel,
  MessageModel,
} from '../db/models/index';

import {
  messageService,
} from './../services';

import { IMessage } from './../db/sharedTypes';

export const getAllMessages = (req: Request, res: Response, next: NextFunction) => {
  MessageModel.findAll({})
    .then((allMessages) => {
      res.status(200);
      res.json(allMessages);
    })
    .catch((err: Error) => {
      res.sendStatus(500);
    });
};

export const getMessagesForUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { start, end } = req.query;

  let searchParams = {
    where: {
      userId,
    },
    offset: (start) ? start : 0,
    limit: 10, // Default, get 10 messages from start
  };

  if (end) {
    searchParams = Object.assign({}, searchParams, {
      limit: end,
    });
  }

  MessageModel.findAll(searchParams)
    .then((allMessages) => {
      res.status(200);
      res.json(allMessages);
    })
    .catch((err: Error) => {
      res.status(500);
    });
}
