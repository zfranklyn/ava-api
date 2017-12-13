// Seed File for Database
// tslint:disable-next-line
const debug = require('debug')('debug/seed');
import * as moment from 'moment';

import * as faker from 'faker';
import {
  UserModel,
  TaskModel,
  StudyModel,
  TagModel,
  StatusModel,
} from './models/index';
import {
  UserRoleType,
  Color,
  ITaskAPI,
  IStudyAPI,
} from './sharedTypes';

import { db } from './_db';

export const seedDatabase = async () => {
  debug('Seeding Database');
  // await seedParticipants(20);
  // await seedResearchers();
  // await seedStudies(10);
  // await seedCustomMessages(3);
  // await seedTasks(1);
  await createRealData();
  debug('Seed Completed');
};

const createRealData = async () => {
  StudyModel.create({
    title: 'Yale Wellbeing Project',
    description: 'This is study exists for system testing purposes',
    metadata: JSON.stringify({surveyLink: 'www.franklyn.xyz'}),
    active: true,
    archived: false,
  })
  .then((newStudy: any) => {
    UserModel.create({
      firstName: 'Franklyn',
      lastName: 'Zhu',
      email: 'zfranklyn@gmail.com',
      tel: '+16509467649',
      userType: 'RESEARCHER',
      userRole: 'ADMIN',
      username: 'zfranklyn',
      password: 'password',
      metadata: JSON.stringify({firstName: 'Franklyn'}),
    })
    .then((newUser: any) => {
      TaskModel.create({
        scheduledTime: moment(Date()).add(35, 'seconds'),
        messageType: 'REMINDER',
        mediumType: 'SMS',
        description: `Reminder`,
        message: 'Reminder for ${firstName}',
        completed: true,
      })
      .then((newTask: any) => {
        newStudy.addUser(newUser);
        newStudy.addTask(newTask);
      });

      TaskModel.create({
        scheduledTime: moment(Date()).add(35, 'seconds'),
        messageType: 'REMINDER',
        mediumType: 'EMAIL',
        subject: 'REMINDER',
        description: `Reminder 2`,
        message: 'Reminder for ${firstName}',
        completed: false,
      })
      .then((newTask: any) => {
        newStudy.addUser(newUser);
        newStudy.addTask(newTask);
      });

      TaskModel.create({
        scheduledTime: moment(Date()).add(10, 'seconds'),
        messageType: 'SURVEY',
        mediumType: 'EMAIL',
        subject: 'Email',
        description: `Survey`,
        message: 'Hello, ${firstName}! Survey is here: ${surveyLink}',
        completed: false,
      })
      .then((newTask: any) => {
        newStudy.addUser(newUser);
        newStudy.addTask(newTask);
      });
    });
  });

};

const seedParticipants = async (num: number) => {
  debug(`Seeding ${num} Participants`);
  return new Promise ( async (resolve, reject) => {
    for (let n = 0; n < num; n++) {
      await UserModel.create({
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
      tel: '+16509467649',
      userType: 'RESEARCHER',
      userRole: 'ADMIN',
      username: 'zfranklyn',
      password: 'password',
      metadata: '{}',
    }).then(() => resolve());
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
        metadata: JSON.stringify({surveyLink: 'www.franklyn.xyz'}),
        active: faker.helpers.randomize([true, false]),
        archived: faker.helpers.randomize([true, false, false, false]),
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

const seedCustomMessages = async (numTasks: number) => {
  debug(`Seeding ${numTasks} custom messages`);
  const allStudies = await StudyModel.findAll();
  allStudies.map(async (study: any) => {
    const newTask = await TaskModel.create({
      scheduledTime: Date(),
      messageType: 'CUSTOM_MESSAGE',
      message: 'Hello, ${firstName}!',
      mediumType: 'SMS',
      description: 'Custom announcement',
    });
    await study.addTask(newTask);
  });
};

const seedTasks = async (numTasks: number) => {
  return new Promise ((resolve, reject) => {
    debug(`Creating ${numTasks} Tasks`);
    StudyModel.findAll()
    .then((allStudies: any) => {
      // create N tasks for each study
      allStudies.map(async (study: any) => {
        for (let n = 0; n < numTasks; n++) {
          await TaskModel.create({
            scheduledTime: Date(),
            messageType: 'SURVEY',
            mediumType: 'SMS',
            description: 'SMS Message',
            message: faker.lorem.sentences(2),
            completed: faker.helpers.randomize([false, true]),
          }).then(async (createdTask: any) => {
            // Create events for each task
            UserModel.findAll()
            .then((allUsers: any) => {
              allUsers.map((user: any) => {
                StatusModel.create()
                .then((createdStatus: any) => {
                  user.addSurveyStatus(createdStatus);
                  createdTask.setSurveyStatus(createdStatus);
                });
              });
            });

            for (let m = 0; m < 3; m++) {
              TaskModel.create({
                scheduledTime: Date(),
                messageType: 'REMINDER',
                mediumType: 'SMS',
                description: `Reminder Number ${m + 1} for Survey ${createdTask.id}, Study ${study.id}`,
                message: `Reminder Number ${m + 1} for Survey ${createdTask.id}, Study ${study.id}`,
                completed: false,
              })
              .then((newReminder: any) => {
                Promise.all([
                  createdTask.addReminder(newReminder),
                  createdTask.setParentSurveyTask(newReminder),
                  study.addTask(newReminder),
                ])
                .then(() => {
                  // debug(`Created and associated Reminder #${m + 1} for Task #${createdTask.id}`);
                });
              });
            }
            study.addTask(createdTask);
          });
        }
      });
    });
    resolve();
  });
};
