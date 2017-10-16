// tslint:disable
const debug = require('debug')('debug/server');

import { UserModel, IUser, UserRoleType, UserType } from './../models';

export const createResearcher = (name: string, tel: string, email: string, username: string, password: string) => {
  debug(`Creating Researcher`);
  const newUserParams: IUser = {
    name, tel, email, 
    userType: 'RESEARCHER',
    userRole: 'ADMIN',
    username,
    password,
  }

  return UserModel.create(newUserParams);
};

export const createParticipant = (name: string, tel: string, email: string, userRole: UserRoleType) => {
  debug('Creating Participant');
  const newUserParams: IUser = {
    name,
    tel,
    email,
    userType: 'PARTICIPANT',
    userRole: userRole,
  }

  return UserModel.create(newUserParams);
};
