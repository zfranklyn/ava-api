import * as Sequelize from 'sequelize';
import { db } from './../_db';
import { MediumType } from './../sharedTypes';

export const TaskModel = db.define('task', {
  timestamp: {
      type: Sequelize.TIME,
      allowNull: false,
  },
  type: {
      type: Sequelize.ENUM('CUSTOM_MESSAGE', 'SURVEY', 'REMINDER', 'RESET'),
      allowNull: false,
  },
  message: {
      type: Sequelize.TEXT,
      allowNull: true,
  },
  medium: {
      type: Sequelize.ENUM('EMAIL', 'SMS', 'APP'),
      allowNull: false,
  },
  completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
});
