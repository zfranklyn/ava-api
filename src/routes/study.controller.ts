// tslint:disable
const debug = require('debug')('debug/study.router');
// tslint:enable
import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';

const StudyRouter = Router();
import {
  StudyModel,
  TaskModel,
  UserModel,
} from '../db/models/index';

import { IStudy } from './../db/sharedTypes';

// Gets all studies in database, truncated data (for bulk display)
export const getAllStudies = (req: Request, res: Response, next: NextFunction) => {
  const { archived, detailed } = req.query;
  let searchParams = {where: {}};

  // only return archived posts if specified
  if (!archived) {
    searchParams.where = Object.assign({}, searchParams.where, {
      archived: false,
    });
  }

  // only include associations if specified
  if (detailed) {
    searchParams = Object.assign({}, searchParams, {
      include: [
        { model: TaskModel },
        { model: UserModel },
      ],
    });
  }

  StudyModel.findAll(searchParams)
    .then((allStudies) => {
      res.json(allStudies);
    });
};

// Gets full details for one particular study
export const getStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  const { detailed } = req.query;
  let searchParams = {where: { id: studyId }};

  // only include associations if specified
  if (detailed) {
    searchParams = Object.assign({}, searchParams, {
      include: [
        { model: TaskModel },
        { model: UserModel },
      ],
    });
  }

  StudyModel.find(searchParams)
    .then((study) => {
      res.status(200);
      res.json(study);
    })
    .catch((err: Error) => {
      debug(err);
      res.sendStatus(404);
    });
};

export const createStudy = (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    description,
    metadata,
  } = req.body;

  StudyModel.create({
    title,
    description,
    metadata,
    active: false,
  })
    .then((newStudy) => {
      res.status(201);
      res.json(newStudy);
    })
    .catch((err) => {
      res.status(400);
    });
};

export const deleteStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  StudyModel.destroy({
    where: {
      id: studyId,
    },
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      res.sendStatus(500);
    });
};

export const updateStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  const {
    title,
    description,
    metadata,
  } = req.body;

  StudyModel.find({
    where: {
      id: studyId,
    },
  })
    .then((foundStudy: any) => {
      if (foundStudy) {
        return foundStudy.updateAttributes({
          title, description, metadata,
        });
      } else {
        res.sendStatus(404);
        next();
      }

    })
    .catch((err) => {
      res.status(400);
    });
};

export const getStudyTasks = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;

  TaskModel.findAll({
    where: {
      studyId,
    },
  })
    .then((foundTasks) => {
      res.status(200);
      res.json(foundTasks);
    })
    .catch((err: Error) => {
      res.sendStatus(400);
    });
};

export const createStudyTask = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  const {
    scheduledTime,
    type,
    message,
    medium,
  } = req.body;

  TaskModel.create({
    scheduledTime,
    type,
    message,
    medium,
  })
    .then((newlyCreatedTask) => {
      res.status(200);
      res.json(newlyCreatedTask);
    })
    .catch((err: Error) => {
      res.sendStatus(500);
    });
};

export const updateStudyTask = (req: Request, res: Response, next: NextFunction) => {
  const { studyId, taskId } = req.params;
  const { scheduledTime, type, message, medium, completed } = req.body;
  TaskModel.find({
    where: {
      id: taskId,
      studyId,
    },
  })
    .then((foundTask: any) => {
      return foundTask.updateAttributes({
        scheduledTime,
        type, message, medium, completed,
      });
    })
    .then((updatedTask: any) => {
      res.status(200);
      res.json(updatedTask);
    })
    .catch((err: Error) => {
      res.sendStatus(500);
    });
};

export const deleteStudyTask = (req: Request, res: Response, next: NextFunction) => {
  const { studyId, taskId } = req.params;
  TaskModel.destroy({
    where: {
      id: taskId,
      studyId,
    },
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      res.sendStatus(500);
    });
};