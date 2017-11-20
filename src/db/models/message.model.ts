import * as Sequelize from 'sequelize';
import { db } from './../_db';

export const MessageModel = db.define('message', {
  content: {
      type: Sequelize.TEXT,
      allowNull: false,
  },
  messageType: {
      type: Sequelize.ENUM('SURVEY', 'REMINDER', 'CUSTOM', 'REPLY'),
      allowNull: false,
  },
  mediumType: {
      type: Sequelize.ENUM('EMAIL', 'SMS', 'APP'),
      allowNull: false,
  },
});
