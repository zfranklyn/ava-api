import * as Sequelize from 'sequelize';
import { db } from './../_db';
import {
  IUser,
  IUserAPI,
} from './../sharedTypes';

export const UserModel = db.define<IUserAPI, any>('user', {
  firstName: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  lastName: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  email: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
          isEmail: true,
      },
  },
  userType: {
      type: Sequelize.ENUM('RESEARCHER', 'PARTICIPANT'),
      allowNull: false,
  },
  tel: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  userRole: {
      type: Sequelize.ENUM('TEACHER', 'STUDENT', 'ADMIN', 'PARENT', 'OTHER'),
      allowNull: false,
  },
  notes: {
      type: Sequelize.TEXT,
      allowNull: true,
  },
});
