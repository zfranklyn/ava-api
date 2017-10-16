// Seed File for Database

// tslint:disable-next-line
const debug = require('debug')('debug/seed');

import * as model from './models';
import * as methods from './methods';
import { db } from './_db';

export const seedDatabase = () => {
  methods.createParticipant({
    email: 'zfranklyn@gmail.com',
    name: 'Franklyn Zhu',
    notes: 'None',
    role: 'ADMIN',
    tel: '6509467649',
    });
};
