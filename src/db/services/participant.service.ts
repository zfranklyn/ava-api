// tslint:disable
const debug = require('debug')('debug/server');
import { Model } from 'sequelize';
import { Transaction } from 'sequelize';

import * as model from '../models';
import { IParticipant, IParticipantInstance } from '../interfaces';

export class ParticipantService {
  public createParticipant: (participantAttributes: IParticipant) => {
    // let promise = new Promise<IParticipantInstance>((resolve: Function, reject: Function) => {
      // sequelize.transaction((t: Transaction))
    // })
  }
}
