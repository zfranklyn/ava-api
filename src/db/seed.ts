// Seed File for Database
// tslint:disable-next-line
const debug = require('debug')('debug/seed');

import * as faker from 'faker';
import * as UserService from './methods/user.method';
import { UserRoleType } from './models';
import { db } from './_db';

export const seedDatabase = () => {
  // seedParticipants(20);
  // seedResearchers();
};

const seedParticipants = (num: number) => {
  debug(`Seeding ${num} Participants`);
  for (let n = 0; n < num; n++) {
    UserService.createParticipant({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      tel: faker.phone.phoneNumber(),
      userRole: faker.helpers.randomize(['TEACHER', 'ADMIN', 'STUDENT']) as UserRoleType,
    });
  }
};

const seedResearchers = () => {
  debug(`Seeding Researchers`);
  UserService.createResearcher({
    firstName: 'Franklyn',
    lastName: 'Zhu',
    email: 'zfranklyn@gmail.com',
    tel: '6509467649',
    username: 'zfranklyn',
    password: 'password',
  });
  UserService.createResearcher({
    firstName: 'Daniel',
    lastName: 'Cordaro',
    email: 'dtcordaro@gmail.com',
    tel: '6509467649',
    username: 'dtcordaro',
    password: 'password',
  });
};
