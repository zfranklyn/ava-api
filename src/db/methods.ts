// tslint:disable
const debug = require('debug')('debug/server');
import { Model } from 'sequelize';

import * as model from './models';
import * as interfaces from './interfaces';

export const createResearcher = (params: interfaces.IResearcher) => {
  debug(`Creating Researcher`);
  debug(params);
  model.Researcher.build(params);
};

export const createParticipant = (params: interfaces.IParticipant) => {
  debug('Creating Participant');
  debug(params);
  return model.Participant.create(params);
};
