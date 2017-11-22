import * as Sequelize from 'sequelize';
import { db } from './../_db';
import { Color } from './../sharedTypes';
import {
  ITag,
  ITagAPI,
} from './../sharedTypes';

export const TagModel = db.define<ITag, any>('tag', {
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
