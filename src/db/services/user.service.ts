// tslint:disable
const debug = require('debug')('debug/server');

import { UserModel, IUser, UserRoleType, UserType } from './../models';

interface INewResearcher {
  name: string;
  tel: string;
  email: string;
  username: string;
  password: string;
}

interface INewParticipant {
  name: string;
  tel: string;
  email: string;
  userRole: UserRoleType;
}

export class UserService {

  public createResearcher = (params: INewResearcher) => {
    debug(`Creating Researcher`);
    const newUserParams: IUser = {
      name: params.name, 
      tel: params.tel,
      email: params.email, 
      userType: 'RESEARCHER',
      userRole: 'ADMIN',
      username: params.username,
      password: params.password,
    }
  
    return UserModel.create(newUserParams);
  };

  public createParticipant = (params: INewParticipant) => {
    debug('Creating Participant');
    const newUserParams: IUser = {
      name: params.name,
      tel: params.tel,
      email: params.email,
      userType: 'PARTICIPANT',
      userRole: params.userRole,
    }
  
    return UserModel.create(newUserParams);
  };
}
