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
  const { start, end } = req.query;

  let searchParams = {
    offset: (start) ? start : 0,
  };

  if (end) {
    searchParams = Object.assign({}, searchParams, {
      limit: end,
    });
  }

  debug(`Getting all users, start: ${start}, end: ${end}`);

  UserModel.findAll(searchParams)
    .then((allUsers: IUserAPI[]) => {
      res.status(200);
      res.json(allUsers);
    })
    .catch((err: Error) => {
      debug(err);
      err.message = 'Could not get users';
      next(err);
    });
};

export const getUserDetails = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  debug(`Getting details for user ${userId}`);

  UserModel.find({
    include: [{all: true}, { model: StudyModel, include: [{model: TaskModel}]}],
    where: {
      id: userId,
    },
  })
    .then((foundUser: IUserAPI | null) => {
      res.status(200);
      res.json(foundUser);
    })
    .catch((err: Error) => {
      debug(err);
      res.sendStatus(400);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  // Does this phone number already exist?
  UserModel.find({
    where: {
      tel: req.body.tel,
    },
  })
  .then((foundUser: IUserAPI | null) => {
    if (foundUser) {
      debug(`User with number ${req.body.tel} already exists`);
      throw new Error(`User with number ${req.body.tel} already exists`);
    } else {
      UserModel.create(req.body)
      .then((newUser: IUserAPI | null) => {
        res.status(200);
        res.json(newUser);
      })
      .catch((err: Error) => {
        debug(err);
        next(err);
      });
    }
  })
  .catch((err: Error) => {
    next(err);
  });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  debug(`Deleting User ${userId}`);
  UserModel.destroy({
    where: {
      id: userId,
    },
  })
    .then(() => res.sendStatus(200))
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  debug(`Updating User ${userId}`);

  // Stringify metadata, if exists
  req.body.metadata = JSON.stringify(req.body.metadata);

  UserModel.find({
    where: {
      id: userId,
    },
  })
    .then((foundUser: any | null) => {
      if (foundUser) {
        debug(req.body);
        return foundUser.updateAttributes(req.body);
      } else {
        throw Error('User does not exist');
      }
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err: Error) => {
      debug(err);
      next(err);
    });
};
