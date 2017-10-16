import * as Sequelize from 'sequelize';
import { db } from './../_db';

export type UserType =
  'RESEARCHER'
  | 'PARTICIPANT';

export type UserRoleType =
  'TEACHER'
  | 'STUDENT'
  | 'ADMIN'
  | 'PARENT'
  | 'OTHER';

export interface IUser {
  name: string;
  email: string;
  tel: string;
  userType: UserType;
  userRole: UserRoleType;
  username?: string;
  password?: string;
  notes?: string;
}

export const UserModel = db.define('user', {
  name: {
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
  username: {
      type: Sequelize.STRING,
      allowNull: true,
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  notes: {
      type: Sequelize.TEXT,
      allowNull: true,
  },
});
