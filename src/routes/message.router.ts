// tslint:disable
const debug = require('debug')('debug/message.router');
let express = require('express');
// tslint:enable

const MessageRouter = express.Router();
import {
  StudyModel,
  TaskModel,
  UserModel,
  MessageModel,
} from '../db/models/index';

import {
  messageService,
} from './../services';

import { IStudy } from './../db/sharedTypes';

// Gets truncated version of studies
MessageRouter.get('/', (req: any, res: any, next: any) => {
  messageService.sendEmailHelper({
    emailAddress: 'zfranklyn@gmail.com',
    content: 'Hello World!',
    subject: 'Testing World',
  })
    .then(console.log)
    .catch(console.error);
  res.sendStatus(200);
});

export { MessageRouter };
