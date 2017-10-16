// tslint:disable
const debug = require('debug')('debug/user-service');

import { UserModel, IUser, UserRoleType, UserType } from './../models/user.model';

interface INewResearcher {
  firstName: string;
  lastName: string;
  tel: string;
  email: string;
  username: string;
  password: string;
}

interface INewParticipant {
  firstName: string;
  lastName: string;
  tel: string;
  email: string;
  userRole: UserRoleType;
}

export const createResearcher = (params: INewResearcher) => {
  debug(`Creating Researcher`);
  const newUserParams: IUser = {
    firstName: params.firstName, 
    lastName: params.lastName, 
    tel: params.tel,
    email: params.email, 
    userType: 'RESEARCHER',
    userRole: 'ADMIN',
    username: params.username,
    password: params.password,
  }

  return UserModel.create(newUserParams);
}

export const createParticipant = (params: INewParticipant) => {
  debug('Creating Participant');
  const newUserParams: IUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    tel: params.tel,
    email: params.email,
    userType: 'PARTICIPANT',
    userRole: params.userRole,
  }

  return UserModel.create(newUserParams);
};
