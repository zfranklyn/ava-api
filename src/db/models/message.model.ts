import * as Sequelize from 'sequelize';
import { db } from './../_db';

export type MediumType =
'EMAIL'
| 'SMS'
| 'APP';

export type MessageType =
'SURVEY'
| 'REMINDER'
| 'CUSTOM';

export interface IMessage {
  content: string;
  messageType: MessageType;
  mediumType: MediumType;
}

export const MessageModel = db.define('message', {
  content: {
      type: Sequelize.TEXT,
      allowNull: false,
  },
  messageType: {
      type: Sequelize.ENUM('SURVEY', 'REMINDER', 'CUSTOM'),
      allowNull: false,
  },
  medium: {
      type: Sequelize.ENUM('EMAIL', 'SMS', 'APP'),
      allowNull: false,
  },
});
