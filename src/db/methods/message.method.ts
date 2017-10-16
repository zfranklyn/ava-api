// tslint:disable
const debug = require('debug')('debug/message-method');

import { MessageModel, IMessage, MessageType, MediumType } from './../models/message.model';

interface INewMessage {
  content: string;
  messageType: MessageType;
  mediumType: MediumType;
}

export const createMessage = (params: INewMessage, sender: any, recipient: any) => {
  debug('Creating Study');
  const newMessageParams: IMessage = {
    content: params.content,
    messageType: params.messageType as MessageType,
    mediumType: params.mediumType as MediumType,
  };

  return MessageModel.create(newMessageParams);
};
