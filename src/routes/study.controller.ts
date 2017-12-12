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

import {
  IStudy,
  IStudyAPI,
  ITaskAPI,
} from './../db/sharedTypes';

// Gets all studies in database, truncated data (for bulk display)
export const getAllStudies = (req: Request, res: Response, next: NextFunction) => {
  const { includeArchived, detailed } = req.query;
  let searchParams = {where: {}, order: [['updatedAt', 'DESC']]};

  // only return archived posts if specified
  if (includeArchived === 'false') {
    searchParams.where = Object.assign({}, searchParams.where, {
      archived: false,
    });
  }

  // only include associations if specified
  if (detailed === 'true') {
    searchParams = Object.assign({}, searchParams, {
      include: [
        { model: TaskModel },
        { model: UserModel },
      ],
    });
  }

  debug(
  `
    Request: retrieve all studies in DB:
      Include Archived: ${includeArchived}
      Detailed: ${detailed}
  `);

  StudyModel.findAll(searchParams)
    .then((allStudies: IStudyAPI[]) => {
      debug(`Success: retrieved all ${allStudies.length} studies`);
      res.json(allStudies);
    })
    .catch((err: Error) => {
      debug(`Failed: could not retrieve studies`);
      next(err);
    });
};

// Gets full details for one particular study
export const getStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  const { associations } = req.query;
  let searchParams = {
    where: {
      id: studyId,
    },
  };

  // only include associations if specified
  if (associations === 'true') {
    searchParams = Object.assign({}, searchParams, {
      include: [
        { model: TaskModel },
        { model: UserModel },
      ],
    });
  }

  debug(`
    Request: retrieve full details for one particular study:
      associations: ${associations}
  `);

  StudyModel.find(searchParams)
    .then((study: IStudyAPI | null) => {
      debug(`Success: retrieved data for Study #${studyId}`);
      res.json(study);
    })
    .catch((err: Error) => {
      debug(`Failed: could not retrieve data from Study #${studyId}`);
      debug(err);
      next(err);
    });
};

// Gets user info for one particular study
export const getStudyUsers = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  const searchParams = {
    where: {
      id: studyId,
    },
    include: [
      { model: UserModel },
    ],
  };

  debug(`
    Request: retrieve users for one particular study
  `);

  StudyModel.find(searchParams)
    .then((study: any) => {
      debug(`Success: retrieved data (with users) for Study #${studyId}`);
      res.json(study.users);
    })
    .catch((err: Error) => {
      debug(`Failed: could not retrieve data (with users) from Study #${studyId}`);
      debug(err);
      next(err);
    });
};

export const createStudy = (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    description,
    metadata,
  } = req.body;

  debug(`Request: create study:`);
  debug(req.body);

  StudyModel.create({
    title,
    description,
    metadata,
    active: false,
  })
    .then((newStudy: IStudyAPI) => {
      debug(`Success: new study created with ID #${newStudy.id}`);
      res.status(201);
      res.json(newStudy);
    })
    .catch((err) => {
      debug(`Failed: study could not be created`);
      debug(err);
      next(err);
    });
};

export const deleteStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  debug(`Request: delete Study #${studyId}`);
  StudyModel.destroy({
    where: {
      id: studyId,
    },
  })
    .then(() => {
      debug(`Success: deleted Study #${studyId}`);
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const updateStudy = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  debug(`Request: update Study #${studyId}`);

  StudyModel.find({
    where: {
      id: studyId,
    },
  })
    .then((foundStudy: any | null) => {
      if (foundStudy) {
        return foundStudy.updateAttributes(req.body)
        .then((updatedStudy: any) => {
          debug(`Success: updated Study #${studyId}`);
          res.json(updatedStudy);
        });
      } else {
        debug(`Failed: study not found`);
        res.sendStatus(404);
      }

    })
    .catch((err) => {
      debug(err);
      next(err);
    });
};

export const getStudyTasks = (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  debug(`Request: retrieve all tasks associated with Study #${studyId}`);

  TaskModel.findAll({
    where: {
      studyId,
    },
  })
    .then((foundTasks: ITaskAPI[]) => {
      debug(`Success: retrieved all ${foundTasks.length} tasks associated with Study #${studyId}`);
      res.json(foundTasks);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const createStudyTask = async (req: Request, res: Response, next: NextFunction) => {
  const { studyId } = req.params;
  debug(`Request: create task associated with Study #${studyId}`);
  debug(req.body);

  const study: any = await StudyModel.findById(studyId);
  if (!study) {
    debug(`Failed: Study #${studyId} does not exist`);
    next(new Error(`Failed: Study #${studyId} does not exist`));
  }

  TaskModel.create(req.body)
    .then((newlyCreatedTask: ITaskAPI | null) => {
      return study.addTask(newlyCreatedTask)
      .then(() => {
        debug(`Success: created task associated with Study #${studyId}`);
        res.json(newlyCreatedTask);
      });
    })
    .catch((err: Error) => {
      debug(`Failed: could not create task associated with Study #${studyId}`);
      res.sendStatus(500);
    });
};

export const updateStudyTask = async (req: Request, res: Response, next: NextFunction) => {
  const { studyId, taskId } = req.params;
  debug(`Request: update Task #${taskId} associated with Study #${studyId}`);

  const study: any = await StudyModel.findById(studyId);
  if (!study) {
    debug(`Failed: Study #${studyId} does not exist`);
    next(new Error(`Failed: Study #${studyId} does not exist`));
  }

  const task: any = await TaskModel.find({
                where: {
                  id: taskId,
                  studyId,
                },
              });

  if (!task) {
    debug(`Failed: Task #${taskId} does not exist`);
    next(new Error(`Failed: Task #${taskId} does not exist`));
  }

  task.updateAttributes(req.body)
    .then((updatedTask: ITaskAPI | null) => {
      debug(`Success: updated Task #${taskId} from Study #${studyId}`);
      res.json(updatedTask);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const deleteStudyTask = (req: Request, res: Response, next: NextFunction) => {
  const { studyId, taskId } = req.params;
  debug(`Request: delete Task #${taskId} associated with Study #${studyId}`);

  TaskModel.destroy({
    where: {
      id: taskId,
      studyId,
    },
  })
    .then(() => {
      debug(`Success: deleted Task #${taskId} associated with Study #${studyId}`);
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};
