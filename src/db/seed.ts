// Seed File for Database
// tslint:disable-next-line
const debug = require('debug')('debug/seed');

import * as faker from 'faker';
import { UserService } from './services';
import { db } from './_db';

export const seedDatabase = () => {
};

const seedParticipants = (num: number) => {
  const userService = new UserService();

  userService.createParticipant({
    name: faker.
  })

}
