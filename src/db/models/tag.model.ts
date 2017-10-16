import * as Sequelize from 'sequelize';
import { db } from './../_db';

export interface ITag {
  text: string;
  color: string;
}

export const TagModel = db.define('tag', {
  text: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  color: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '#137CBD',
  },
});
