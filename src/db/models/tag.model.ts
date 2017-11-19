import * as Sequelize from 'sequelize';
import { db } from './../_db';
import { Color } from './../sharedTypes';

export const TagModel = db.define('tag', {
  text: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  color: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: Color.BLUE,
  },
});
