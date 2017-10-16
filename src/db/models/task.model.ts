import * as Sequelize from 'sequelize';
import { db } from './../_db';

export type TaskType =
'SMS'
| 'EMAIL'
| 'REMINDER'
| 'MESSAGE'
| 'RESET';

export interface ITask {
  timestamp: string;
  type: TaskType;
  message: string;
  completed: boolean;
}

export const TaskModel = db.define('task', {
  timestamp: {
      type: Sequelize.TIME,
      allowNull: false,
  },
  type: {
      type: Sequelize.ENUM('SMS', 'EMAIL', 'REMINDER', 'MESSAGE', 'RESET'),
      allowNull: false,
  },
  message: {
      type: Sequelize.TEXT,
      allowNull: true,
  },
  completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
});
