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
  debug(`Get all messages`);
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

  debug(`Getting messages for User ${userId}, start ${start}, end ${end}`);

  MessageModel.findAll(searchParams)
    .then((allMessages) => {
      res.status(200);
      res.json(allMessages);
    })
    .catch((err: Error) => {
      res.status(500);
    });
};

export const deleteMessage = (req: Request, res: Response, next: NextFunction) => {
  const { messageId } = req.params;
  debug(`Deleting message (ID: ${messageId})`);
  MessageModel.destroy({
    where: {
      id: messageId,
    },
  })
    .then(() =>  {
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      res.sendStatus(400);
    });
};

export const sendMessage = (req: Request, res: Response, next: NextFunction) => {
  const { mediumType, messageType, recipientUserID } = req.query;
  debug(`Create Message, ${mediumType}, ${messageType}, to ${recipientUserID}`);
  res.sendStatus(501);
};

export const receiveMessage = (req: Request, res: Response, next: NextFunction) => {
  const { mediumType, messageType, recipientUserID } = req.query;
  const { message } = req.body;
  debug(`Received Message`);
  res.sendStatus(501);
};
