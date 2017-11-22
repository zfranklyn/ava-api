import * as Sequelize from 'sequelize';
import { db } from './../_db';
import {
  IStudy,
  IStudyAPI,
} from './../sharedTypes';

export const StudyModel = db.define<IStudyAPI, any>('study', {
  title: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  description: {
      type: Sequelize.TEXT,
      allowNull: true,
  },
  metadata: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '{}', // stringified JSON
  },
  active: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
  },
  archived: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
  },
});
