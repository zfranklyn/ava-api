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
import * as cors from 'cors';

import * as MessageController from './message.controller';
import * as StudyController from './study.controller';
import * as UserController from './user.controller';
import * as TaskController from './task.controller';
import * as ActionController from './action.controller';

export const MainRouter = Router();

/* STUDY ROUTES */
// Gets a list of all studies, with minimal data
// ?includeArchived=true&detailed=false
MainRouter.get('/studies', StudyController.getAllStudies);
// Gets all data for a specified study
// ?associations=true
MainRouter.get('/study/:studyId', StudyController.getStudy);
// Gets all users associated with specified study
MainRouter.get('/study/:studyId/users', StudyController.getStudyUsers);
// Deletes all data for a specified study
MainRouter.delete('/study/:studyId', StudyController.deleteStudy);
// Creates a study
MainRouter.post('/study/create', StudyController.createStudy);
// Updates a single study
MainRouter.put('/study/:studyId', StudyController.updateStudy);
// Gets all tasks for a specified study
MainRouter.get('/study/:studyId/tasks', StudyController.getStudyTasks);
// Gets all recent tasks for a specified study, ± 7 days
MainRouter.get('/study/:studyId/recentTasks', StudyController.getStudyRecentTasks);
// Creates a task for a specified study
MainRouter.post('/study/:studyId/task', StudyController.createStudyTask);
// Updates a task for a specified study
MainRouter.put('/study/:studyId/task/:taskId', StudyController.updateStudyTask);
// Deletes a task for a specified study
MainRouter.delete('/study/:studyId/task/:taskId', StudyController.deleteStudyTask);

/* MESSAGE ROUTES */
MainRouter.get('/messages', MessageController.getAllMessages);
// Gets all messages for specified user
// ?start=0&limit=10
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
// ?start=0&limit=10
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
// Get all data for a single task
MainRouter.get('/task/:taskId', TaskController.getTask);
// Get all tasks from a specific Study (and all associations)
MainRouter.get('/tasks/study/:studyId', TaskController.getTasksForStudy);
// Create a task for a specific study; must specify ParentSurveyTaskId if it is a REMINDER
MainRouter.post('/task/study/:studyId', TaskController.createTaskForStudy);
// Update a task
MainRouter.put('/task/:taskId', TaskController.updateTask);
// Delete a task
MainRouter.delete('/task/:taskId', TaskController.deleteTask);
// Get Task Statuses
MainRouter.get('/task/:taskId/statuses', TaskController.getStatuses);

/* ACTIONS */
// Adds association between a user and a study
// ?studyId, ?userId
MainRouter.post('/actions/addUserToStudy', ActionController.addUserToStudy);
// Removes association between user and a study
// ?studyId, ?userId
MainRouter.post('/actions/removeUserFromStudy', ActionController.removeUserFromStudy);
// Qualtrics endpoint for completing a survey task
// ?eventId
MainRouter.post('/actions/event/complete', ActionController.completeEvent);
