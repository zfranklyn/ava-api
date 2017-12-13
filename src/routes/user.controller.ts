// tslint:disable
const debug = require('debug')('debug/user.router');
// tslint:enable

import {
  Request,
  Response,
  NextFunction,
} from 'express';

import {
  UserModel,
  StudyModel,
  TaskModel,
 } from '../db/models/index';

import {
  IUserAPI,
} from '../db/sharedTypes';

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { start, limit } = req.query;

  let searchParams = {
    offset: (start) ? start : 0,
    include: [{all: true}, { model: StudyModel }],
  };

  if (limit) {
    searchParams = Object.assign({}, searchParams, {
      limit,
    });
  }

  debug(`Request: Getting all users, start: ${start}, limit: ${limit}`);

  UserModel.findAll(searchParams)
    .then((allUsers: IUserAPI[]) => {
      debug(`Success: retrieved and sending ${allUsers.length} users`);
      res.json(allUsers);
    })
    .catch((err: Error) => {
      debug(`Failed: could not retrieve all users`);
      debug(err);
      next(err);
    });
};

export const getUserDetails = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  debug(`Requst: retrieve all details for user ${userId}`);

  UserModel.find({
    include: [{all: true}, { model: StudyModel, include: [{model: TaskModel}]}],
    where: {
      id: userId,
    },
  })
    .then((foundUser: IUserAPI | null) => {
      debug(`Success: Retrieved details:`);
      debug(foundUser);
      res.json(foundUser);
    })
    .catch((err: Error) => {
      debug(`Failed: to retrieve all details for user ${userId}`);
      debug(err);
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  // Does this phone number already exist?
  debug(`Request: create new user with number ${req.body.tel}`);
  UserModel.find({
    where: {
      tel: req.body.tel,
    },
  })
  .then((foundUser: IUserAPI | null) => {
    if (foundUser) {
      debug(`Failed: User with number ${req.body.tel} already exists`);
      next(new Error(`User with number ${req.body.tel} already exists`));
    } else {
      UserModel.create(req.body)
      .then((newUser: any) => {
        debug(`Success: new user created:`);
        debug(newUser);
        res.json(newUser);
      })
      .catch((err: Error) => {
        debug(`Failed: new user could not be created`);
        debug(err);
        next(err);
      });
    }
  })
  .catch((err: Error) => {
    debug(err);
    next(err);
  });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  debug(`Request: delete User #${userId}`);
  UserModel.destroy({
    where: {
      id: userId,
    },
  })
    .then(() => {
      debug(`Success: deleted User #${userId}`);
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      debug(`Failed: User #${userId} could not be deleted`);
      debug(err);
      next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  debug(`Request: update User #${userId} with following data:`);
  debug(req.body);

  // Stringify metadata, if exists
  req.body.metadata = JSON.stringify(req.body.metadata);

  UserModel.find({
    where: {
      id: userId,
    },
  })
    .then((foundUser: any | null) => {
      if (foundUser) {
        debug(`\tPrevious User:`);
        debug(`\t${foundUser}`);
        foundUser.updateAttributes(req.body)
        .then((updatedUser: any) => {
          debug(`Success: User #${userId} has been updated`);
          res.json(updatedUser);
        })
        .catch((err: Error) => {
          debug(`Failed: User #${userId} could not be updated`);
          debug(err);
          next(err);
        });
      } else {
        debug(`Failed: User #${userId} does not exist`);
        next(new Error(`User #${userId} does not exist`));
      }
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};
