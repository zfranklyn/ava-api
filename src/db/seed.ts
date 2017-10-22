// Seed File for Database
// tslint:disable-next-line
const debug = require('debug')('debug/seed');

import * as faker from 'faker';
import * as UserModel from './models/user.model';
import * as TaskModel from './models/task.model';
import * as StudyModel from './models/study.model';
import { UserRoleType } from './models';
import { db } from './_db';

export const seedDatabase = async () => {
  debug('Seeding Database');
  await seedParticipants(5);
  await seedResearchers();
  await seedStudies(3);
  await seedTasks(3);
  debug('Seed Completed');
};

const seedParticipants = async (num: number) => {
  debug(`Seeding ${num} Participants`);
  return new Promise ((resolve, reject) => {
    for (let n = 0; n < num; n++) {
      UserModel.UserModel.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        tel: faker.phone.phoneNumber(),
        userType: 'PARTICIPANT',
        userRole: faker.helpers.randomize(['TEACHER', 'ADMIN', 'STUDENT']) as UserRoleType,
      });
    }
    resolve();
  });
};

const seedResearchers = async () => {
  debug(`Seeding Researchers`);
  return new Promise ((resolve, reject) => {
    UserModel.UserModel.create({
      firstName: 'Franklyn',
      lastName: 'Zhu',
      email: 'zfranklyn@gmail.com',
      tel: '6509467649',
      userType: 'RESEARCHER',
      userRole: 'ADMIN',
      username: 'zfranklyn',
      password: 'password',
    }).then(() => {
      UserModel.UserModel.create({
        firstName: 'Daniel',
        lastName: 'Cordaro',
        email: 'dtcordaro@gmail.com',
        tel: '6509467649',
        userRole: 'ADMIN',
        userType: 'RESEARCHER',
        username: 'dtcordaro',
        password: 'password',
      }).then(() => resolve());
    });
  });
};

const seedStudies = async (num: number) => {
  return new Promise ((resolve, reject) => {
    for (let n = 0; n < num; n++) {
      StudyModel.StudyModel.create({
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        metadata: '{}',
      })
      .then((newStudy: any) => {
        // assign administrators
        UserModel.UserModel.findAll({
        })
        .then((allUsers: any[]) => {
          const admins = allUsers.filter((user: any) => user.userType === 'RESEARCHER');
          const participants = allUsers.filter((user: any) => user.userType === 'PARTICIPANT');

          newStudy.setCreator(admins[0]);
          newStudy.addUsers(participants);

        })
        .then(() => {
          resolve();
        });
      });
    }
  });
};

const seedTasks = async (numTasks: number) => {
  return new Promise ((resolve, reject) => {
    StudyModel.StudyModel.findAll()
    .then((allStudies: any) => {
      // create N tasks for each study
      allStudies.map((study: any) => {
        for (let n = 0; n < numTasks; n++) {
          TaskModel.TaskModel.create({
            timestamp: new Date(),
            type: 'SMS',
            message: faker.lorem.sentences(2),
            completed: false,
          }).then((createdTask: any) => {
            debug('created task');
            createdTask.setStudy(study);
          });
        }
      });
    });
    resolve();
  });
};
