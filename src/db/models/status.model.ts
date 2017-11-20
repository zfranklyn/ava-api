import * as Sequelize from 'sequelize';
import { db } from './../_db';

/*
  Every execution of a Survey Task is associated with a Status.
  This allows we need to keep track of who has/hasn't completed a survey.
*/
export const StatusModel = db.define('status', {
  completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
  completionTime: {
      type: Sequelize.TIME,
      allowNull: false,
  },
});
