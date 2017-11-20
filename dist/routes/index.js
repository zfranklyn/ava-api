"use strict";
/*
  This file contains all the API endpoints.
  Specific routes are implemented in controllers, which
  are also in this folder.

  I've decided to base the file structure off MDN's tutorial:
  https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

  The API is designed with best practices referred to in this article:
  http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
*/
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// import * as MessageController from './message.controller';
var StudyController = require("./study.controller");
exports.MainRouter = express_1.Router();
/* STUDY ROUTES */
// Gets a list of all studies, with minimal data
// 'archived': whether should display archieved studies as well
// 'detailed': whether should also fetch associations
exports.MainRouter.get('/studies', StudyController.getAllStudies);
// Gets all data for a specified study
exports.MainRouter.get('/study/:studyId', StudyController.getStudy);
// Deletes all data for a specified study
exports.MainRouter.delete('/study/:studyId', StudyController.deleteStudy);
// Creates a study
exports.MainRouter.post('/study/create', StudyController.createStudy);
// Updates a single study
exports.MainRouter.put('/study/:studyId/update', StudyController.updateStudy);
// Gets all tasks for a specified study
exports.MainRouter.get('/study/:studyId/tasks', StudyController.getStudyTasks);
// Creates a task for a specified study
exports.MainRouter.post('/study/:studyId/task', StudyController.createStudyTask);
// Updates a task for a specified study
exports.MainRouter.put('/study/:studyId/task/:taskId', StudyController.updateStudyTask);
// Deletes a task for a specified study
exports.MainRouter.delete('/study/:studyId/task/:taskId', StudyController.deleteStudyTask);
