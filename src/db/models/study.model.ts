import * as Sequelize from 'sequelize';
import { db } from './../_db';

export const StudyModel = db.define('study', {
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
