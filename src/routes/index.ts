/*
  This file contains all the API endpoints.
  Specific routes are implemented in controllers, which
  are also in this folder.

  I've decided to base the file structure off MDN's tutorial:
  https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

  The API is designed with best practices referred to in this article:
  http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
*/

import {
  Router,
} from 'express';

import * as MessageController from './message.controller';
import * as StudyController from './study.controller';

export const MainRouter = Router();

/* STUDY ROUTES */
// Gets a list of all studies, with minimal data
  // 'archived': whether should display archieved studies as well
  // 'detailed': whether should also fetch associations
MainRouter.get('/studies', StudyController.getAllStudies);
// Gets all data for a specified study (?detailed BOOL, ?archived BOOL)
MainRouter.get('/study/:studyId', StudyController.getStudy);
// Deletes all data for a specified study (?detailed BOOL)
MainRouter.delete('/study/:studyId', StudyController.deleteStudy);
// Creates a study
MainRouter.post('/study/create', StudyController.createStudy);
// Updates a single study
MainRouter.put('/study/:studyId/update', StudyController.updateStudy);
// Gets all tasks for a specified study
MainRouter.get('/study/:studyId/tasks', StudyController.getStudyTasks);
// Creates a task for a specified study
MainRouter.post('/study/:studyId/task', StudyController.createStudyTask);
// Updates a task for a specified study
MainRouter.put('/study/:studyId/task/:taskId', StudyController.updateStudyTask);
// Deletes a task for a specified study
MainRouter.delete('/study/:studyId/task/:taskId', StudyController.deleteStudyTask);

/* MESSAGE ROUTES */
MainRouter.get('/messages', MessageController.getAllMessages);
// Gets all messages for specified user (?start NUM, ?end NUM)
// Messages are retrieved with most recent at index 0
MainRouter.get('/messages/:userId', MessageController.getMessagesForUser);

// Deletes specified message
MainRouter.delete('/message/:messageId', MessageController.deleteMessage);
MainRouter.post('/message/send', MessageController.sendMessage);
MainRouter.post('/message/receive', MessageController.receiveMessage);
