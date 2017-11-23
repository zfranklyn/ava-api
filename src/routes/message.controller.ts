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
  messageService, registrationService,
} from './../services';

import {
  IMessage,
  IMessageAPI,
  MediumType,
  MEDIUM_TYPE,
  MESSAGE_MEDIUM,
  IUserAPI,
  IStudyAPI,
} from './../db/sharedTypes';

export const getAllMessages = (req: Request, res: Response, next: NextFunction) => {
  debug(`Get all messages`);
  MessageModel.findAll()
    .then((allMessages: IMessageAPI[]) => {
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
    .then((allMessages: IMessageAPI[]) => {
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

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  let { mediumType, messageType, content, subject, userId, studyId } = req.body;
  debug(`Create Message, ${mediumType}, ${messageType}, to ${userId}`);

  let userData: any | null;
  let studyData: any | null;
  [ userData, studyData ] = await Promise.all([UserModel.findById(userId), StudyModel.findById(studyId)]);

  if (!userData) {
    debug(`User with ID ${userId} does not exist`);
    res.send(404).json({error: `User with ID ${userId} does not exist`});
    return;
  }

  if (studyData) {
    const dataToInterpolate = Object.assign(
                                {},
                                JSON.parse(studyData.metadata),
                                userData.dataValues,
                                JSON.parse(userData.dataValues.metadata),
                              );
    try {
      content = messageService.interpolateMessage(content, dataToInterpolate);
    } catch (err) {
      next(err);
      return;
    }
  }

  switch (mediumType) {
    case MEDIUM_TYPE.SMS:
      messageService.sendSMSHelper({
        content,
        recipient: userData.tel,
      }, (err: Error, data: any) => {
        if (err) {
          debug(`ERROR, SMS not sent`);
          debug(err);
          next(err);
        } else {
          debug(`SMS Sent`);
          messageService.createMessage({
            content,
            mediumType: MESSAGE_MEDIUM.SMS as MediumType,
            messageType,
            userId: userData.id,
          })
            .then(() => {
              debug('Message Created');
              res.sendStatus(200);
            })
            .catch((errorCreate: Error) => {
              debug('Message creation failed');
              debug(errorCreate);
              next(errorCreate);
            });
        }
      });
      break;
    case MEDIUM_TYPE.EMAIL:
      messageService.sendEmailHelper({
        messageType,
        content,
        subject,
        userId: userData.id,
        emailAddress: userData.email,
      }, (err: Error, data: any) => {
        if (err) {
          debug(`ERROR, email not sent`);
          debug(err);
          res.sendStatus(400);
        } else {
          debug(`SMS Sent`);
          debug(data);
          messageService.createMessage({
            content,
            mediumType: MESSAGE_MEDIUM.EMAIL as MediumType,
            messageType,
            userId: userData.id,
          })
            .then(() => {
              debug('Message Created');
              res.sendStatus(200);
            })
            .catch((messageCreationError: Error) => {
              debug('Message creation failed');
              debug(messageCreationError);
              next(messageCreationError);
            });
        }
      });
      break;
    case MEDIUM_TYPE.APP:
      debug(`Sending APP Message`);
      res.sendStatus(501);
      next();
      break;
    default:
      debug(`Default`);
      res.sendStatus(501);
      next();
      break;
  }
};

export const receiveSMS = (req: Request, res: Response, next: NextFunction) => {
  // const { mediumType, messageType, content, userId } = req.body;
  // const { message } = req.body;
  const { From, Body, FromState, FromCity, FromCountry } = req.body;
  debug(`Received Message from ${From}`);
  debug(Body);

  if (Body === 'REGISTER') {
    registrationService.parseRegistrationMessage(Body, From);
    return;
  }

  UserModel.find({
    where: {
      tel: From,
    },
  })
    .then((foundUser: IUserAPI | null) => {
      if (foundUser) {
        debug(`Identified User: ${foundUser.id}`);
        messageService.createMessage({
          content: Body,
          mediumType: 'SMS',
          messageType: 'REPLY',
          userId: foundUser.id,
        });

        // Respond with empty message to prevent Twilio error
        const twiml = messageService.generateEmptyResponse();
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(twiml.toString());
      } else {
        debug(`Unidentified User`);
        const twiml = messageService.generateEmptyResponse();
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(twiml.toString());
      }
    })
    .catch(debug);
};
