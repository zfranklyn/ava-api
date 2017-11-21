// tslint:disable
const debug = require('debug')('debug/message.service');
// tslint:enable
import * as twilio from 'twilio';
import * as config from 'config';
import * as AWS from 'aws-sdk';
import {
  IMessage,
  ITask,
  IUser,
  MessageMedium,
  MessageType,
} from './../db/sharedTypes';
import {
  MessageModel,
  UserModel,
  TaskModel,
} from './../db/models/index';
import { TwimlResponse } from 'twilio';

interface IEmailHelper {
  emailAddress: string;
  userId: string;
  subject: string;
  content: string;
  messageType: MessageType;
}

interface ISMSHelper {
  recipient: string;
  content: string;
  messageType: MessageType;
  userId: string;
}

interface ICreateMessage {
  userId: string;
  studyId?: string | null;
  mediumType: MessageMedium;
  messageType: MessageType;
  content: string;
}

class MessageService {

  private twilioClient: any;
  private twilioAuthToken: string = config.get('twilioAuthToken');
  private twilioSID: string = config.get('twilioSID');
  private twilioNumber: string = config.get('twilioNumber');

  private SES: any;
  private gmailAddress: string = config.get('gmailAddress');

  constructor() {
    this.twilioClient = new twilio(this.twilioSID, this.twilioAuthToken);
    this.SES = new AWS.SES({apiVersion: '2010-12-01', region: 'us-east-1'});
  }

  /*
    Helper Function for sending SMS via Twilio
  */
  public sendSMSHelper = (obj: ISMSHelper, callback: any) => {
    this.twilioClient.messages.create({
      body: obj.content,
      to: obj.recipient,
      from: this.twilioNumber,
    }, callback);
  }

  /*
    Helper Function for sending Email via AWS SES.
    Check out the docs here:
    http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html
  */
  public sendEmailHelper = (obj: IEmailHelper, callback: any) => {

    // Parameter object to pass onto AWS API
    const params = {
      Destination: {
        ToAddresses: [
          obj.emailAddress,
        ],
      },
      Message: {
        Body: {
          // for HTML compatible clients
          Html: {
            Charset: 'UTF-8',
            Data: obj.content,
          },
          // for raw text rendering
          Text: {
            Charset: 'UTF-8',
            Data: obj.content,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: obj.subject, // email subject
        },
      },
      Source: this.gmailAddress,
    };

    // Returns promise for sending email
    this.SES.sendEmail(params, callback);
  }

  /*
  When a new message is created, it must be associated with:
  * User
  * Study? (optional: standalone messages are allowed)

  Further needs to specify:
  * who is the recipient or sender?
  * what's the medium? (medium)
  * was this sent automatically, or manually? (messageType)
  */
  public createMessage = (obj: ICreateMessage) => {
    debug(`Creating Message Entry`);
    debug(obj);
    const { content, mediumType, messageType, userId } = obj;
    return MessageModel.create({
      content, mediumType, messageType,
      userId,
    });
  }

  public generateEmptyResponse = () => {
    const twiml = new twilio.twiml.MessagingResponse();
    return twiml.message();
  }

}

export const messageService = new MessageService();
