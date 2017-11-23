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
import * as UserController from './user.controller';
import * as TaskController from './task.controller';

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
MainRouter.get('/messages/user/:userId', MessageController.getMessagesForUser);
// Deletes specified message
MainRouter.delete('/message/:messageId', MessageController.deleteMessage);
// Sends message (via mediumType) and creates a Message Entry
// Message entries cannot be created by themselves; they are side-effects of sending messages
MainRouter.post('/message/send', MessageController.sendMessage);
// Receives a message (could be email, SMS), and creates a Message Entry
MainRouter.post('/message/receive/sms', MessageController.receiveSMS);

/* USER ROUTES */
// Get all users (but no associations)
MainRouter.get('/users', UserController.getAllUsers);
// Get details (associations) for one specified user
MainRouter.get('/user/:userId', UserController.getUserDetails);
// Create a new user, need: [firstName, lastName, email, userType, tel, userRole]
MainRouter.post('/user', UserController.createUser);
// Delete specified user
MainRouter.delete('/user/:userId', UserController.deleteUser);
// Update specified user data
MainRouter.put('/user/:userId', UserController.updateUser);

/* TASK ROUTES */
// Get all tasks in DB
MainRouter.get('/tasks', TaskController.getAllTasks);
// Get all tasks from a specific Study (and all associations)
MainRouter.get('/tasks/study/:studyId', TaskController.getTasksForStudy);
// Create a task for a specific study; must specify ParentSurveyTaskId if it is a REMINDER
MainRouter.post('/task/study/:studyId', TaskController.createTaskForStudy);
// Update a task
MainRouter.put('/task/:taskId', TaskController.updateTask);
// Delete a task
MainRouter.delete('/task/:taskId', TaskController.deleteTask);
// Qualtrics endpoint for completing a survey task
MainRouter.post('/task/complete', TaskController.completeTask);
