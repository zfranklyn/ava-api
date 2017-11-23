import * as Sequelize from 'sequelize';
import { db } from './../_db';
import {
  IStatus,
  IStatusAPI,
} from './../sharedTypes';

/*
  Every execution of a Survey Task is associated with a Status.
  This allows we need to keep track of who has/hasn't completed a survey.
*/
export const StatusModel = db.define<IStatusAPI, any>('status', {
  completed: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
  },
  completionTime: {
      type: Sequelize.TIME,
      allowNull: true,
      defaultValue: null,
  },
});
