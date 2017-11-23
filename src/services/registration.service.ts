// tslint:disable
const debug = require('debug')('debug/registration.service');
let twilio = require('twilio');
// tslint:enable
import * as config from 'config';
import * as _ from 'lodash';
import {
  IMessage,
  ITask,
  IUser,
  IUserAPI,
  MessageMedium,
  MessageType,
} from './../db/sharedTypes';
import {
  MessageModel,
  UserModel,
  TaskModel,
} from './../db/models/index';
import { TwimlResponse } from 'twilio';
import {
  messageService,
} from './';

/*
  The RegistrationService class will handle
  all forms of registration, including:
  * Registration via web form
  * Registration via text messages

  We'll assume that parseRegistrationMessage is only called
  when 'REGISTER' is texted
*/
class RegistrationService {
  private registrationLink = 'www.franklyn.xyz';

  public parseRegistrationMessage = (message: string, tel: string) => {
    UserModel.find({
      where: {
        tel,
      },
    })
    .then((foundUser: IUserAPI | null) => {
      if (foundUser) {
        messageService.sendSMSHelper({
          recipient: tel,
          content: `You have already registered, User #${foundUser.id}`,
        }, debug);
      } else {
        messageService.sendSMSHelper({
          recipient: tel,
          content: `Welcome to AVA! Please register at the following link: ${this.registrationLink}/${tel}`,
        }, debug);
      }
    });
  }

}

export const registrationService = new RegistrationService();
