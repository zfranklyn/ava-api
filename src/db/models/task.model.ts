import * as Sequelize from 'sequelize';
import { db } from './../_db';
import {
    ITaskAPI,
    MediumType,
    ITask,
} from './../sharedTypes';

export const TaskModel = db.define<ITaskAPI, any>('task', {
  scheduledTime: {
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
  description: {
      type: Sequelize.TEXT,
      allowNull: true,
  },
  mediumType: {
      type: Sequelize.ENUM('EMAIL', 'SMS', 'APP'),
      allowNull: false,
  },
  completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
});
