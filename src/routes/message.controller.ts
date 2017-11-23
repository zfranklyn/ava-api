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
  debug(`Request: get all messages in database`);
  MessageModel.findAll()
    .then((allMessages: IMessageAPI[]) => {
      debug(`Success: retrieved and sending ${allMessages.length} messages in database`);
      res.json(allMessages);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const getMessagesForUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { start, limit } = req.query;

  let searchParams = {
    where: {
      userId,
    },
    offset: (start) ? start : 0,
    limit: 10, // Default, get 10 messages from start
  };

  if (limit) {
    searchParams = Object.assign({}, searchParams, {
      limit,
    });
  }

  debug(`Request: retrieve messages for User #${userId}, startIndex: ${start}, limit: ${limit}`);

  MessageModel.findAll(searchParams)
    .then((allMessages: IMessageAPI[]) => {
      debug(`Success: retrieved and sending ${allMessages.length} messages`);
      res.json(allMessages);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const deleteMessage = (req: Request, res: Response, next: NextFunction) => {
  const { messageId } = req.params;
  debug(`Request: delete message ${messageId}`);
  MessageModel.destroy({
    where: {
      id: messageId,
    },
  })
    .then((deletedMessage: any) =>  {
      debug(`Success: message ${messageId} deleted`);
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  let { mediumType, messageType, content, subject, userId, studyId } = req.body;
  debug(`
    Request: create new message:
      mediumType: ${mediumType}
      messageType: ${messageType}
      studyId: ${studyId}
      recipient userId:${userId}
      subject:${subject}
      content: ${content}`);

  let userData: any | null;
  let studyData: any | null;
  [ userData, studyData ] = await Promise.all([UserModel.findById(userId), StudyModel.findById(studyId)]);

  if (!userData) {
    debug(`Failed: Recipient User #${userId} does not exist`);
    next(new Error(`Failed: Recipient User #${userId} does not exist`));
  }

  const dataToInterpolate = Object.assign(
                              {},
                              (studyData) ? JSON.parse(studyData.metadata) : {}, // only if studyData exists
                              userData.dataValues,
                              JSON.parse(userData.dataValues.metadata),
                            );
  try {
    content = messageService.interpolateMessage(content, dataToInterpolate);
    debug(`Interpolated message:`);
    debug(`${content}`);
  } catch (err) {
    debug(err);
    next(err);
    return;
  }

  debug('Sending message:');
  switch (mediumType) {
    case MEDIUM_TYPE.SMS:
      messageService.sendSMSHelper({
        content,
        recipient: userData.tel,
      }, (err: Error, data: any) => {
        if (err) {
          debug(`Failed: SMS failed to send`);
          debug(err);
          next(err);
        } else {
          debug(`Success: SMS Sent`);
          messageService.createMessage({
            content,
            mediumType: MESSAGE_MEDIUM.SMS as MediumType,
            messageType,
            userId: userData.id,
          })
            .then(() => {
              debug('Success: message record created');
              res.sendStatus(200);
            })
            .catch((errorCreate: Error) => {
              debug('Failed: message record creation failed');
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
          debug(`Failed: email failed to send`);
          debug(err);
          res.sendStatus(400);
        } else {
          debug(`Success: email sent`);
          debug(data);
          messageService.createMessage({
            content,
            mediumType: MESSAGE_MEDIUM.EMAIL as MediumType,
            messageType,
            userId: userData.id,
          })
            .then(() => {
              debug('Success: message record created');
              res.sendStatus(200);
            })
            .catch((messageCreationError: Error) => {
              debug('Success: message record created');
              debug(messageCreationError);
              next(messageCreationError);
            });
        }
      });
      break;
    case MEDIUM_TYPE.APP:
      debug(`UNIMPLEMENTED: sending APP message`);
      res.sendStatus(501);
      break;
    default:
      debug(`Default`);
      res.sendStatus(501);
      break;
  }
};

export const receiveSMS = (req: Request, res: Response, next: NextFunction) => {
  const { From, Body, FromState, FromCity, FromCountry } = req.body;
  debug(`
    Received Message:
      From: ${From}
      Body: ${Body}`);

  if (Body === 'REGISTER') {
    debug(`Attempting Registration Process for number ${From}`);
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
        })
        .then((createdMessage: any) => {
          debug(`Success: created message record for recieved SMS`);
        })
        .catch((err: Error) => {
          debug(err);
          next(err);
        });

        // Respond with empty message to prevent Twilio error
        const twiml = messageService.generateEmptyResponse();
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(twiml.toString());
      } else {
        debug(`Error: unidentified user`);
        const twiml = messageService.generateEmptyResponse();
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(twiml.toString());
      }
    })
    .catch(debug);
};
