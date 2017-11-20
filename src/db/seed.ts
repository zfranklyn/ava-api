// Seed File for Database
// tslint:disable-next-line
const debug = require('debug')('debug/seed');

import * as faker from 'faker';
import {
  UserModel,
  TaskModel,
  StudyModel,
  TagModel,
} from './models/index';
import { UserRoleType, Color } from './sharedTypes';

import { db } from './_db';

export const seedDatabase = async () => {
  debug('Seeding Database');
  await seedParticipants(500);
  await seedResearchers();
  await seedStudies(3);
  await seedTasks(3);
  debug('Seed Completed');
};

const seedParticipants = async (num: number) => {
  debug(`Seeding ${num} Participants`);
  return new Promise ((resolve, reject) => {
    for (let n = 0; n < num; n++) {
      UserModel.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        tel: faker.phone.phoneNumber(),
        userType: 'PARTICIPANT',
        userRole: faker.helpers.randomize(['TEACHER', 'ADMIN', 'STUDENT']) as UserRoleType,
      })
        .then((newParticipant: any) => {
          TagModel.create({
            text: 'Student',
            color: Color.FOREST,
          })
            .then((newTag) => {
              newParticipant.addTag(newTag);
            });
        });
    }
    resolve();
  });
};

const seedResearchers = async () => {
  debug(`Seeding Researchers`);
  return new Promise ((resolve, reject) => {
    UserModel.create({
      firstName: 'Franklyn',
      lastName: 'Zhu',
      email: 'zfranklyn@gmail.com',
      tel: '6509467649',
      userType: 'RESEARCHER',
      userRole: 'ADMIN',
      username: 'zfranklyn',
      password: 'password',
    }).then(() => {
      UserModel.create({
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
      StudyModel.create({
        title: faker.helpers.randomize(['Corbett Prep Biweekly Study',
                                        'Royal Academy Semester Survey',
                                        'Yale Wellbeing Weekly Survey',
                                        'Beijing Private School Survey',
                                      ]),
        description: faker.helpers.randomize([
          'Survey measuring psychological wellbeing, educator burnout.',
          'SMS survey designed to get baseline measurements.',
          'Full email survey with complete battery of psychological tests',
          'Survey announcement, introduction to the system',
        ]),
        metadata: '{surveyLink: "www.franklyn.xyz"}',
      })
      .then((newStudy: any) => {
        // assign administrators
        UserModel.findAll()
          .then((allUsers: any[]) => {
            const admins = allUsers.filter((user: any) => user.userType === 'RESEARCHER');
            const participants = allUsers.filter((user: any) => user.userType === 'PARTICIPANT');

            newStudy.setCreator(admins[0]);
            newStudy.addUsers(participants);
          });

        TagModel.create({
          text: faker.helpers.randomize(['Bhutan', 'Corbett Prep', 'Yale University', 'New Haven', 'USA']),
          color: Color.BLUE,
        })
          .then((newTag) => {
            newStudy.addTag(newTag);
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
    StudyModel.findAll()
    .then((allStudies: any) => {
      // create N tasks for each study
      allStudies.map((study: any) => {
        for (let n = 0; n < numTasks; n++) {
          TaskModel.create({
            scheduledTime: new Date(),
            type: 'SURVEY',
            medium: 'SMS',
            message: faker.lorem.sentences(2),
            completed: false,
          }).then((createdTask: any) => {
            debug('created task');
            study.addTask(createdTask);
          });
        }
      });
    });
    resolve();
  });
};
